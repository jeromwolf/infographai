"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTestLogin = () => {
    // 테스트용 로그인 - 인증 없이 대시보드로 이동
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email || "test@test.com");
    router.push("/dashboard/builder");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-96">
        <h1 className="text-2xl font-bold text-white mb-6">테스트 로그인</h1>
        <div className="mb-4">
          <input
            type="email"
            placeholder="이메일 (선택사항)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="비밀번호 (선택사항)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg"
          />
        </div>
        <button
          onClick={handleTestLogin}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold"
        >
          바로 시작하기 (인증 없이)
        </button>
        <div className="mt-4 text-gray-400 text-sm text-center">
          테스트 모드 - 인증 없이 빌더 사용 가능
        </div>
      </div>
    </div>
  );
}