const nextConfig = {
  reactStrictMode: true, // 리액트의 엄격 모드 활성화
  poweredByHeader: false, // 일반적으로 보얀 취약점으로 취급되는 X-Powered-By 헤더 제거
  eslint: {
    ignoreDuringBuilds: true, // 빌드시에 ESLint를 무시
  },
  styledComponents: true,
}

module.exports = nextConfig
