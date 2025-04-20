import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// URL 유효성 검사 추가
let validUrl = supabaseUrl;
try {
  // URL 객체를 생성하여 유효성 검사
  if (supabaseUrl) new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  validUrl = 'https://afppkxoactqarlnnhdpa.supabase.co'; // 보안 문제로 실제 애플리케이션에선 이렇게 하지 마세요
}

console.log('Supabase URL:', validUrl); // 디버깅용

// 실시간 기능 활성화 옵션 추가
export const supabase = createClient(validUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
}); 