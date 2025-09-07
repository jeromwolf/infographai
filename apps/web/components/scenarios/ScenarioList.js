"use strict";
/**
 * 시나리오 목록 컴포넌트
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScenarioList;
const react_1 = __importStar(require("react"));
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const table_1 = require("@/components/ui/table");
const dropdown_menu_1 = require("@/components/ui/dropdown-menu");
const lucide_react_1 = require("lucide-react");
const navigation_1 = require("next/navigation");
const use_toast_1 = require("@/components/ui/use-toast");
function ScenarioList() {
    const [scenarios, setScenarios] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [page, setPage] = (0, react_1.useState)(1);
    const [totalPages, setTotalPages] = (0, react_1.useState)(1);
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        fetchScenarios();
    }, [page]);
    const fetchScenarios = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/scenarios?page=${page}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok)
                throw new Error('Failed to fetch scenarios');
            const data = await response.json();
            setScenarios(data.scenarios);
            setTotalPages(data.pagination.pages);
        }
        catch (error) {
            console.error('Error fetching scenarios:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: '시나리오 목록을 불러올 수 없습니다.',
                variant: 'destructive'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('정말로 이 시나리오를 삭제하시겠습니까?'))
            return;
        try {
            const response = await fetch(`/api/scenarios/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok)
                throw new Error('Failed to delete scenario');
            (0, use_toast_1.toast)({
                title: '성공',
                description: '시나리오가 삭제되었습니다.'
            });
            fetchScenarios();
        }
        catch (error) {
            console.error('Error deleting scenario:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: '시나리오 삭제에 실패했습니다.',
                variant: 'destructive'
            });
        }
    };
    const handleClone = async (id) => {
        try {
            const response = await fetch(`/api/scenarios/${id}/clone`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            if (!response.ok)
                throw new Error('Failed to clone scenario');
            (0, use_toast_1.toast)({
                title: '성공',
                description: '시나리오가 복제되었습니다.'
            });
            fetchScenarios();
        }
        catch (error) {
            console.error('Error cloning scenario:', error);
            (0, use_toast_1.toast)({
                title: '오류',
                description: '시나리오 복제에 실패했습니다.',
                variant: 'destructive'
            });
        }
    };
    const getStatusBadge = (status) => {
        const variants = {
            draft: 'secondary',
            ready: 'default',
            processing: 'outline',
            completed: 'default'
        };
        const labels = {
            draft: '초안',
            ready: '준비됨',
            processing: '처리 중',
            completed: '완료'
        };
        return (<badge_1.Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </badge_1.Badge>);
    };
    const getTypeBadge = (type) => {
        const labels = {
            auto: 'AI 생성',
            user: '사용자 작성',
            hybrid: '하이브리드',
            template: '템플릿',
            imported: '가져오기'
        };
        return (<badge_1.Badge variant="outline">
        {labels[type] || type}
      </badge_1.Badge>);
    };
    if (loading) {
        return (<div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>);
    }
    return (<card_1.Card>
      <card_1.CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <card_1.CardTitle>시나리오 관리</card_1.CardTitle>
            <card_1.CardDescription>
              비디오 생성을 위한 시나리오를 관리합니다
            </card_1.CardDescription>
          </div>
          <button_1.Button onClick={() => router.push('/scenarios/new')}>
            <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
            새 시나리오
          </button_1.Button>
        </div>
      </card_1.CardHeader>
      <card_1.CardContent>
        <table_1.Table>
          <table_1.TableHeader>
            <table_1.TableRow>
              <table_1.TableHead>제목</table_1.TableHead>
              <table_1.TableHead>프로젝트</table_1.TableHead>
              <table_1.TableHead>타입</table_1.TableHead>
              <table_1.TableHead>상태</table_1.TableHead>
              <table_1.TableHead>버전</table_1.TableHead>
              <table_1.TableHead>수정일</table_1.TableHead>
              <table_1.TableHead className="text-right">액션</table_1.TableHead>
            </table_1.TableRow>
          </table_1.TableHeader>
          <table_1.TableBody>
            {scenarios.length === 0 ? (<table_1.TableRow>
                <table_1.TableCell colSpan={7} className="text-center text-muted-foreground">
                  시나리오가 없습니다. 새 시나리오를 만들어보세요.
                </table_1.TableCell>
              </table_1.TableRow>) : (scenarios.map((scenario) => (<table_1.TableRow key={scenario.id}>
                  <table_1.TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <lucide_react_1.FileText className="h-4 w-4 text-muted-foreground"/>
                      {scenario.title}
                    </div>
                  </table_1.TableCell>
                  <table_1.TableCell>{scenario.project?.title || '-'}</table_1.TableCell>
                  <table_1.TableCell>{getTypeBadge(scenario.type)}</table_1.TableCell>
                  <table_1.TableCell>{getStatusBadge(scenario.status)}</table_1.TableCell>
                  <table_1.TableCell>
                    <span className="text-sm text-muted-foreground">
                      v{scenario._count?.versions || 1}
                    </span>
                  </table_1.TableCell>
                  <table_1.TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(scenario.updatedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </table_1.TableCell>
                  <table_1.TableCell className="text-right">
                    <dropdown_menu_1.DropdownMenu>
                      <dropdown_menu_1.DropdownMenuTrigger asChild>
                        <button_1.Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">메뉴 열기</span>
                          <lucide_react_1.MoreVertical className="h-4 w-4"/>
                        </button_1.Button>
                      </dropdown_menu_1.DropdownMenuTrigger>
                      <dropdown_menu_1.DropdownMenuContent align="end">
                        <dropdown_menu_1.DropdownMenuLabel>작업</dropdown_menu_1.DropdownMenuLabel>
                        <dropdown_menu_1.DropdownMenuItem onClick={() => router.push(`/scenarios/${scenario.id}/edit`)}>
                          <lucide_react_1.Edit className="mr-2 h-4 w-4"/>
                          편집
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuItem onClick={() => handleClone(scenario.id)}>
                          <lucide_react_1.Copy className="mr-2 h-4 w-4"/>
                          복제
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuItem onClick={() => router.push(`/scenarios/${scenario.id}/video`)}>
                          <lucide_react_1.Film className="mr-2 h-4 w-4"/>
                          비디오 생성
                        </dropdown_menu_1.DropdownMenuItem>
                        <dropdown_menu_1.DropdownMenuSeparator />
                        <dropdown_menu_1.DropdownMenuItem onClick={() => handleDelete(scenario.id)} className="text-destructive">
                          <lucide_react_1.Trash2 className="mr-2 h-4 w-4"/>
                          삭제
                        </dropdown_menu_1.DropdownMenuItem>
                      </dropdown_menu_1.DropdownMenuContent>
                    </dropdown_menu_1.DropdownMenu>
                  </table_1.TableCell>
                </table_1.TableRow>)))}
          </table_1.TableBody>
        </table_1.Table>

        {totalPages > 1 && (<div className="flex items-center justify-center space-x-2 py-4">
            <button_1.Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              이전
            </button_1.Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <button_1.Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              다음
            </button_1.Button>
          </div>)}
      </card_1.CardContent>
    </card_1.Card>);
}
