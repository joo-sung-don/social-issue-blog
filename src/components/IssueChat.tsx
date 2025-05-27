"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';

interface ChatMessage {
  id: string;
  issue_slug: string;
  sender_name: string;
  message: string;
  created_at: string;
  is_system_message?: boolean;
  stance?: 'agree' | 'disagree' | 'neutral';
}

interface IssueChatProps {
  issueSlug: string;
}

// 채팅 제한 관련 상수
const MAX_MESSAGES_PER_MINUTE = 10; // 1분당 최대 메시지 수
const SAME_MESSAGE_COOLDOWN = 30; // 초 단위, 같은 메시지 재전송 쿨다운
const FLOOD_BAN_DURATION = 120; // 초 단위, 도배 시 차단 시간
const MIN_MESSAGE_INTERVAL = 1; // 초 단위, 연속 메시지 사이 최소 간격

// 스팸 메시지 패턴 정규식
const SPAM_PATTERN = /(viagra|casino|lottery|\$\$\$|make money|www\.|http:|https:)/i;

// 입장 타입 정의
type Stance = 'agree' | 'disagree' | 'neutral' | null;

export default function IssueChat({ issueSlug }: IssueChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  
  // 채팅 제한 상태
  const [isChatBanned, setIsChatBanned] = useState(false);
  const [banEndTime, setBanEndTime] = useState<Date | null>(null);
  const [remainingBanTime, setRemainingBanTime] = useState(0);
  const [recentMessages, setRecentMessages] = useState<Date[]>([]);
  const [lastSentMessages, setLastSentMessages] = useState<{message: string, time: Date}[]>([]);
  const [showRules, setShowRules] = useState(false);
  
  // 찬성/반대/중립 입장 선택 및 필터링
  const [userStance, setUserStance] = useState<Stance>(null);
  const [selectedFilter, setSelectedFilter] = useState<Stance | 'all'>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // IP 주소 가져오기 및 차단 상태 확인
  useEffect(() => {
    const getIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        
        const ip = data.ip;
        setIpAddress(ip);
        
        // IP 차단 여부 체크
        if (ip) {
          await checkIfBanned(ip);
        }
      } catch (error) {
        console.error('IP 주소를 가져오는 데 실패했습니다:', error);
        // 실패 시 임시 IP 할당 (실제 구현에서는 다른 방식 고려)
        setIpAddress('unknown');
      }
    };
    
    getIP();
  }, []);
  
  // IP 차단 여부 확인 함수
  const checkIfBanned = async (ip: string) => {
    try {
      // Supabase banned_ips 테이블에서 차단 정보 조회
      const { data, error } = await supabase
        .from('banned_ips')
        .select('*')
        .eq('ip_address', ip)
        .gt('banned_until', new Date().toISOString())
        .order('banned_until', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('차단 정보 조회 오류:', error);
        return;
      }
      
      // 차단된 IP가 있으면 차단 상태 설정
      if (data && data.length > 0) {
        const bannedInfo = data[0];
        const bannedUntil = new Date(bannedInfo.banned_until);
        
        setIsChatBanned(true);
        setBanEndTime(bannedUntil);
        
        // 남은 시간 계산
        const now = new Date();
        const remainingSeconds = Math.max(0, Math.floor((bannedUntil.getTime() - now.getTime()) / 1000));
        setRemainingBanTime(remainingSeconds);
        
        // 시스템 메시지 추가
        const banMessage: ChatMessage = {
          id: `system-ban-${Date.now()}`,
          issue_slug: issueSlug,
          sender_name: 'System',
          message: `${bannedInfo.reason} 때문에 ${Math.floor(remainingSeconds / 60)}분 ${remainingSeconds % 60}초 동안 채팅이 제한됩니다.`,
          created_at: new Date().toISOString(),
          is_system_message: true
        };
        
        setMessages(prev => {
          // 이미 차단 메시지가 있는지 확인 (중복 방지)
          const hasBanMessage = prev.some(msg => 
            msg.is_system_message && msg.message.includes('채팅이 제한됩니다')
          );
          
          if (!hasBanMessage) {
            return [...prev, banMessage];
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('차단 상태 확인 중 오류 발생:', err);
    }
  };

  // 채팅 차단 시간 카운트다운
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isChatBanned && banEndTime) {
      timer = setInterval(() => {
        const now = new Date();
        const remainingSeconds = Math.max(0, Math.floor((banEndTime.getTime() - now.getTime()) / 1000));
        
        setRemainingBanTime(remainingSeconds);
        
        if (remainingSeconds === 0) {
          setIsChatBanned(false);
          setBanEndTime(null);
          clearInterval(timer);
          
          // 차단 해제 시스템 메시지 추가
          const unbanMessage: ChatMessage = {
            id: `system-${Date.now()}`,
            issue_slug: issueSlug,
            sender_name: 'System',
            message: '채팅 차단이 해제되었습니다. 채팅 규칙을 준수해 주세요.',
            created_at: new Date().toISOString(),
            is_system_message: true
          };
          
          setMessages(prev => [...prev, unbanMessage]);
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isChatBanned, banEndTime, issueSlug]);

  // 채팅 차단 함수 (서버 측 및 클라이언트 측 모두 차단)
  const banChat = async (duration: number, reason: string) => {
    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + duration);
    
    // 클라이언트 측 상태 업데이트
    setIsChatBanned(true);
    setBanEndTime(endTime);
    setRemainingBanTime(duration);
    
    // 시스템 메시지 추가
    const banMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      issue_slug: issueSlug,
      sender_name: 'System',
      message: `${reason} 때문에 ${duration}초 동안 채팅이 제한됩니다.`,
      created_at: new Date().toISOString(),
      is_system_message: true
    };
    
    setMessages(prev => [...prev, banMessage]);
    
    // IP 주소가 있으면 서버 측 차단 추가 (Supabase banned_ips 테이블)
    if (ipAddress) {
      try {
        // Supabase 직접 삽입은 RLS 정책으로 인해 제한될 수 있으므로 독립 실행 SQL 직접 호출
        const { error } = await supabase.rpc('ban_user_ip', {
          ip: ipAddress,
          reason_text: reason,
          duration_seconds: duration
        });
        
        if (error) {
          console.error('IP 차단 처리 오류:', error);
          
          // RPC가 없는 경우 직접 INSERT 시도
          try {
            await supabase.from('banned_ips').insert([{
              ip_address: ipAddress,
              reason: reason,
              banned_until: endTime.toISOString(),
              created_by: 'client'
            }]);
          } catch (insertError) {
            console.error('직접 차단 정보 삽입 오류:', insertError);
          }
        }
      } catch (err) {
        console.error('서버 측 차단 처리 중 오류 발생:', err);
      }
    }
  };

  // 스팸 검사 함수
  const checkForSpam = (message: string): boolean => {
    return SPAM_PATTERN.test(message);
  };

  // 채팅 규칙 위반 검사
  const checkForChatViolation = (message: string): { isValid: boolean; reason: string } => {
    // 이미 차단 중인 경우
    if (isChatBanned) {
      return { 
        isValid: false, 
        reason: `채팅 차단 중입니다. ${remainingBanTime}초 후에 다시 시도해 주세요.` 
      };
    }
    
    // 메시지가 비어있는 경우
    if (!message.trim()) {
      return { isValid: false, reason: '메시지를 입력해 주세요.' };
    }
    
    // 스팸 패턴 검사
    if (checkForSpam(message)) {
      banChat(FLOOD_BAN_DURATION, '스팸 메시지 감지');
      return { 
        isValid: false, 
        reason: '스팸으로 의심되는 내용이 포함되어 있습니다.' 
      };
    }
    
    const now = new Date();
    
    // 너무 빠른 연속 메시지 검사
    if (recentMessages.length > 0) {
      const lastMessageTime = recentMessages[recentMessages.length - 1];
      const secondsSinceLastMessage = (now.getTime() - lastMessageTime.getTime()) / 1000;
      
      if (secondsSinceLastMessage < MIN_MESSAGE_INTERVAL) {
        return { 
          isValid: false, 
          reason: '메시지를 너무 빠르게 보내고 있습니다. 잠시 후 다시 시도해 주세요.' 
        };
      }
    }
    
    // 1분 내 메시지 수 제한
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const recentMessageCount = recentMessages.filter(time => time > oneMinuteAgo).length;
    
    if (recentMessageCount >= MAX_MESSAGES_PER_MINUTE) {
      banChat(FLOOD_BAN_DURATION, '도배 감지');
      return { 
        isValid: false, 
        reason: '도배가 감지되었습니다. 잠시 후에 다시 시도해 주세요.' 
      };
    }
    
    // 동일 메시지 재전송 검사
    const recentDuplicates = lastSentMessages.filter(
      item => item.message === message && 
      (now.getTime() - item.time.getTime()) / 1000 < SAME_MESSAGE_COOLDOWN
    );
    
    if (recentDuplicates.length > 0) {
      return { 
        isValid: false, 
        reason: `동일한 메시지를 ${SAME_MESSAGE_COOLDOWN}초 이내에 반복할 수 없습니다.` 
      };
    }
    
    return { isValid: true, reason: '' };
  };

  // 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('issue_slug', issueSlug)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }

        console.log('Fetched messages:', data?.length || 0);
        setMessages(data || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    // 실시간 구독 - 단순화된 버전
    console.log('Setting up realtime subscription for:', issueSlug);
    
    const channel = supabase
      .channel('public:chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `issue_slug=eq.${issueSlug}`
        },
        (payload) => {
          console.log('✅ Realtime message received:', payload);
          const newMessage = payload.new as ChatMessage;
          
          setMessages((currentMessages) => {
            console.log('Current messages count:', currentMessages.length);
            console.log('Adding new message:', newMessage);
            const updated = [...currentMessages, newMessage];
            console.log('Updated messages count:', updated.length);
            return updated;
          });
        }
      )
      .subscribe((status) => {
        console.log('🔄 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel subscription error');
        }
      });

    return () => {
      console.log('🔄 Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [issueSlug]);

  // 로컬 스토리지에서 발신자 이름 불러오기
  useEffect(() => {
    const storedName = localStorage.getItem('chat-sender-name');
    if (storedName) {
      setSenderName(storedName);
    }
  }, []);

  // 필터링된 메시지 계산
  const filteredMessages = useMemo(() => {
    if (selectedFilter === 'all') {
      return messages;
    }
    
    return messages.filter(msg => {
      // 시스템 메시지는 항상 표시
      if (msg.is_system_message) return true;
      // 선택된 필터와 일치하는 입장만 표시
      return msg.stance === selectedFilter;
    });
  }, [messages, selectedFilter]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [filteredMessages]);

  // 입장별 메시지 수 계산
  const stanceCount = useMemo(() => {
    const count = {
      agree: 0,
      disagree: 0,
      neutral: 0,
      all: messages.filter(msg => !msg.is_system_message).length
    };

    messages.forEach(msg => {
      if (!msg.is_system_message && msg.stance) {
        count[msg.stance]++;
      }
    });

    return count;
  }, [messages]);

  // 메시지 필터 변경 핸들러
  const handleFilterChange = (filter: Stance | 'all') => {
    setSelectedFilter(filter);
  };

  // 메시지 전송 처리
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!senderName.trim()) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    
    if (!userStance) {
      setError('입장(찬성/반대/중립)을 선택해 주세요.');
      return;
    }
    
    // 서버 차단 정보 재확인 (차단 우회 방지)
    if (ipAddress) {
      try {
        const { data } = await supabase
          .from('banned_ips')
          .select('*')
          .eq('ip_address', ipAddress)
          .gt('banned_until', new Date().toISOString())
          .limit(1);
          
        // 서버에서 차단된 상태인데 로컬에서는 차단되지 않은 경우
        if (data && data.length > 0 && !isChatBanned) {
          const bannedInfo = data[0];
          const bannedUntil = new Date(bannedInfo.banned_until);
          
          setIsChatBanned(true);
          setBanEndTime(bannedUntil);
          
          // 남은 시간 계산
          const now = new Date();
          const remainingSeconds = Math.max(0, Math.floor((bannedUntil.getTime() - now.getTime()) / 1000));
          setRemainingBanTime(remainingSeconds);
          
          setError(`현재 차단된 상태입니다. ${Math.floor(remainingSeconds / 60)}분 ${remainingSeconds % 60}초 후에 다시 시도해 주세요.`);
          return;
        }
      } catch (err) {
        console.error('차단 상태 확인 중 오류:', err);
      }
    }
    
    // 채팅 규칙 위반 검사
    const validation = checkForChatViolation(newMessage);
    if (!validation.isValid) {
      setError(validation.reason);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 로컬 스토리지에 발신자 이름 저장
      localStorage.setItem('chat-sender-name', senderName);
      // 로컬 스토리지에 사용자 입장 저장
      localStorage.setItem('chat-user-stance', userStance);
      
      // 메시지 전송 기록 업데이트
      const now = new Date();
      setRecentMessages(prev => [...prev, now]);
      setLastSentMessages(prev => [...prev, { message: newMessage, time: now }]);
      
      // 메시지 객체 생성 (try/catch로 스키마 오류 방지)
      const messageData: any = {
        issue_slug: issueSlug,
        sender_name: senderName,
        message: newMessage,
        ip_address: ipAddress
      };
      
      // stance 필드가 스키마에 있는 경우에만 추가 (오류 방지)
      try {
        messageData.stance = userStance;
      } catch (err) {
        console.warn('stance 필드를 추가할 수 없습니다. Supabase에 해당 컬럼을 추가해주세요.');
      }
      
      // Supabase에 메시지 저장
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([messageData])
        .select();

      if (error) {
        console.error('Error sending message:', error);
        
        // 서버 측 오류 메시지 처리
        if (error.message.includes('도배 감지')) {
          // 서버에서 IP 차단이 되므로 클라이언트도 차단 상태로 설정
          const duration = FLOOD_BAN_DURATION;
          const reason = '서버에서 도배가 감지됨';
          await banChat(duration, reason);
          // 서버 측에서 이미 차단되었지만 UI에 표시
          setError(`도배 감지: ${Math.floor(duration / 60)}분 ${duration % 60}초 동안 채팅이 제한됩니다.`);
          
          // 차단 정보 재조회로 UI 동기화
          if (ipAddress) {
            setTimeout(() => checkIfBanned(ipAddress), 1000);
          }
        } else if (error.message.includes('같은 메시지')) {
          setError('같은 메시지를 너무 자주 보내고 있습니다.');
        } else if (error.message.includes('차단된 IP')) {
          // 서버에서 IP가 이미 차단된 상태
          setError('현재 차단된 IP 주소입니다. 잠시 후에 다시 시도해 주세요.');
          // 차단 정보 재조회로 UI 동기화
          if (ipAddress) {
            await checkIfBanned(ipAddress);
          }
        } else if (error.message.includes('스팸 메시지')) {
          // 서버에서 스팸 감지로 IP 차단됨
          const duration = FLOOD_BAN_DURATION;
          const reason = '스팸 메시지 감지';
          await banChat(duration, reason);
          setError(`스팸 감지: ${Math.floor(duration / 60)}분 ${duration % 60}초 동안 채팅이 제한됩니다.`);
          
          // 차단 정보 재조회로 UI 동기화
          if (ipAddress) {
            setTimeout(() => checkIfBanned(ipAddress), 1000);
          }
        } else if (error.message.includes('stance')) {
          // stance 필드 관련 오류 처리
          console.error('stance 필드 오류:', error);
          setError('메시지를 보낼 수 없습니다. 잠시 후 다시 시도해주세요.');
          
          // 로컬에서 클라이언트 측 데이터 추가 (임시 해결책)
          const tempMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            issue_slug: issueSlug,
            sender_name: senderName,
            message: newMessage,
            created_at: new Date().toISOString(),
            stance: userStance
          };
          setMessages(prev => [...prev, tempMessage]);
          setNewMessage('');
          setIsLoading(false);
          return;
        } else {
          setError(error.message || '메시지 전송 중 오류가 발생했습니다.');
        }
        
        return;
      }

      // 실시간 이벤트 전에 UI 업데이트를 위해 직접 추가
      if (data && data.length > 0) {
        // 서버 응답에 stance가 없으면 클라이언트에서 추가
        const newMessage = data[0] as ChatMessage;
        if (!newMessage.stance && userStance) {
          newMessage.stance = userStance;
        }
        setMessages((prev) => [...prev, newMessage]);
      }

      setNewMessage('');
    } catch (err) {
      console.error('Error in sending message:', err);
      setError('메시지 전송 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 스토리지에서 발신자 이름과 입장 불러오기
  useEffect(() => {
    const storedName = localStorage.getItem('chat-sender-name');
    if (storedName) {
      setSenderName(storedName);
    }
    
    const storedStance = localStorage.getItem('chat-user-stance') as Stance;
    if (storedStance) {
      setUserStance(storedStance);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">실시간 토론</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
            onClick={() => setShowRules(!showRules)}
          >
            <InfoCircledIcon className="h-4 w-4" /> 
            <span className="text-sm font-medium">채팅 규칙</span>
          </Button>
        </div>
      </div>
      
      {showRules && (
        <Alert className="mb-6 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300">
          <AlertDescription>
            <h3 className="font-semibold mb-2 text-indigo-900 dark:text-indigo-200">채팅 규칙</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>1분당 최대 {MAX_MESSAGES_PER_MINUTE}개 메시지 제한</li>
              <li>같은 메시지는 {SAME_MESSAGE_COOLDOWN}초 후에 재전송 가능</li>
              <li>도배 시 {FLOOD_BAN_DURATION}초 동안 채팅 차단</li>
              <li>스팸/홍보성 메시지는 금지됩니다</li>
              <li>욕설, 비방, 차별적 발언은 금지됩니다</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* 입장 필터 탭 */}
      <div className="flex items-center mb-4 border-b">
        <div className="flex space-x-1">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedFilter === 'all' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            전체 ({stanceCount.all})
          </button>
          <button
            onClick={() => handleFilterChange('agree')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedFilter === 'agree' 
                ? 'border-green-500 text-green-600 dark:text-green-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            찬성 ({stanceCount.agree})
          </button>
          <button
            onClick={() => handleFilterChange('disagree')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedFilter === 'disagree' 
                ? 'border-red-500 text-red-600 dark:text-red-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            반대 ({stanceCount.disagree})
          </button>
          <button
            onClick={() => handleFilterChange('neutral')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              selectedFilter === 'neutral' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            중립 ({stanceCount.neutral})
          </button>
        </div>
      </div>
      
      <div className="h-96 overflow-y-auto mb-6 p-4 border rounded-xl bg-gray-50 dark:bg-zinc-950 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 space-y-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">
              {selectedFilter === 'all' 
                ? '아직 메시지가 없습니다. 첫 메시지를 보내보세요!' 
                : `아직 ${selectedFilter === 'agree' ? '찬성' : selectedFilter === 'disagree' ? '반대' : '중립'} 입장의 메시지가 없습니다.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`${
                  msg.is_system_message 
                    ? 'bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg text-center' 
                    : 'animate-fadeIn'
                }`}
              >
                {!msg.is_system_message ? (
                  <div className="flex items-start group">
                    <div className="relative">
                      <Avatar className={`h-9 w-9 mr-3 border-2 border-white dark:border-zinc-800 shadow-sm ${
                        msg.stance === 'agree' 
                          ? 'ring-2 ring-green-400' 
                          : msg.stance === 'disagree' 
                            ? 'ring-2 ring-red-400' 
                            : msg.stance === 'neutral' 
                              ? 'ring-2 ring-blue-400' 
                              : ''
                      }`}>
                        <AvatarFallback className={`${
                          msg.stance === 'agree' 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                            : msg.stance === 'disagree' 
                              ? 'bg-gradient-to-br from-red-500 to-rose-600' 
                              : msg.stance === 'neutral' 
                                ? 'bg-gradient-to-br from-blue-500 to-sky-600' 
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        } text-white font-medium`}>
                          {msg.sender_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {msg.stance && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white border border-white dark:border-zinc-800"
                          style={{
                            backgroundColor: 
                              msg.stance === 'agree' 
                                ? '#10b981' 
                                : msg.stance === 'disagree' 
                                  ? '#ef4444' 
                                  : '#3b82f6'
                          }}
                        >
                          {msg.stance === 'agree' ? '찬' : msg.stance === 'disagree' ? '반' : '중'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline">
                        <span className="font-semibold text-sm mr-2 text-gray-900 dark:text-gray-100">{msg.sender_name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:opacity-100 opacity-70 transition-opacity">
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-800 dark:text-gray-200 break-words">{msg.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-amber-700 dark:text-amber-400 text-sm font-medium py-1">{msg.message}</div>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <Alert className="mb-4 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900">
          <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {isChatBanned ? (
        <Card className="mb-4 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
          <CardContent className="p-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              <p className="text-red-600 dark:text-red-400 font-medium">채팅이 제한되었습니다</p>
            </div>
            <p className="text-sm mt-2 text-red-500 dark:text-red-400">
              남은 시간: {Math.floor(remainingBanTime / 60)}분 {remainingBanTime % 60}초
            </p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSendMessage} className="space-y-4">
          {!senderName && (
            <div className="relative">
              <Input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={senderName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenderName(e.target.value)}
                className="w-full pl-10 h-11 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                maxLength={20}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}

          {/* 입장 선택 버튼 그룹 */}
          <div className="flex items-center space-x-2 my-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">내 입장:</span>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={userStance === 'agree' ? 'default' : 'outline'}
                className={`h-auto py-1 px-3 text-sm ${userStance === 'agree' ? 'bg-green-500 hover:bg-green-600' : 'text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/30'}`}
                onClick={() => setUserStance('agree')}
              >
                찬성
              </Button>
              <Button
                type="button"
                variant={userStance === 'disagree' ? 'default' : 'outline'}
                className={`h-auto py-1 px-3 text-sm ${userStance === 'disagree' ? 'bg-red-500 hover:bg-red-600' : 'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30'}`}
                onClick={() => setUserStance('disagree')}
              >
                반대
              </Button>
              <Button
                type="button"
                variant={userStance === 'neutral' ? 'default' : 'outline'}
                className={`h-auto py-1 px-3 text-sm ${userStance === 'neutral' ? 'bg-blue-500 hover:bg-blue-600' : 'text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/30'}`}
                onClick={() => setUserStance('neutral')}
              >
                중립
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 relative">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="메시지를 입력하세요"
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                className="w-full pl-4 pr-10 h-12 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading || !senderName || !userStance}
                maxLength={300}
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !senderName || !userStance || !newMessage.trim()}
              className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-500 disabled:hover:to-purple-600"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>전송</span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
} 