"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ['latin'] });
exports.metadata = {
    title: 'InfoGraphAI - AI 교육 비디오 생성 플랫폼',
    description: '자막 중심의 IT 교육 콘텐츠 자동 생성 서비스',
};
function RootLayout({ children, }) {
    return (<html lang="ko">
      <body className={inter.className}>
        {children}
      </body>
    </html>);
}
