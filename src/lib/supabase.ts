import { createClient } from '@supabase/supabase-js';

// 환경변수가 없을 때 기본값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://afppkxoactqarlnnhdpa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcHBreG9hY3RxYXJsbm5oZHBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjE5NzQsImV4cCI6MjA1MDUzNzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

// URL 유효성 검사
let validUrl = supabaseUrl;
try {
  if (supabaseUrl) new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  validUrl = 'https://afppkxoactqarlnnhdpa.supabase.co';
}

console.log('🔧 Supabase Configuration:');
console.log('📍 URL:', validUrl);
console.log('🔑 Key exists:', !!supabaseAnonKey);

// Supabase 클라이언트 생성 - 실시간 최적화
export const supabase = createClient(validUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 50,  // 이벤트 처리 속도 증가
    },
    heartbeatIntervalMs: 30000,  // 30초마다 heartbeat
    reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000),  // 재연결 지연시간
  },
  auth: {
    persistSession: false,  // 채팅에서는 세션 유지 불필요
  },
}); 