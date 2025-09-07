/**
 * 시나리오 목록 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  MoreVertical,
  FileText,
  Film,
  Clock,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface Scenario {
  id: string;
  title: string;
  description: string;
  type: 'auto' | 'user' | 'hybrid' | 'template' | 'imported';
  status: 'draft' | 'ready' | 'processing' | 'completed';
  projectId: string;
  project?: {
    title: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    versions: number;
  };
}

export default function ScenarioList() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
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

      if (!response.ok) throw new Error('Failed to fetch scenarios');

      const data = await response.json();
      setScenarios(data.scenarios);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast({
        title: '오류',
        description: '시나리오 목록을 불러올 수 없습니다.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 시나리오를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/scenarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete scenario');

      toast({
        title: '성공',
        description: '시나리오가 삭제되었습니다.'
      });

      fetchScenarios();
    } catch (error) {
      console.error('Error deleting scenario:', error);
      toast({
        title: '오류',
        description: '시나리오 삭제에 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  const handleClone = async (id: string) => {
    try {
      const response = await fetch(`/api/scenarios/${id}/clone`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) throw new Error('Failed to clone scenario');

      toast({
        title: '성공',
        description: '시나리오가 복제되었습니다.'
      });

      fetchScenarios();
    } catch (error) {
      console.error('Error cloning scenario:', error);
      toast({
        title: '오류',
        description: '시나리오 복제에 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      ready: 'default',
      processing: 'outline',
      completed: 'default'
    };

    const labels: Record<string, string> = {
      draft: '초안',
      ready: '준비됨',
      processing: '처리 중',
      completed: '완료'
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      auto: 'AI 생성',
      user: '사용자 작성',
      hybrid: '하이브리드',
      template: '템플릿',
      imported: '가져오기'
    };

    return (
      <Badge variant="outline">
        {labels[type] || type}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>시나리오 관리</CardTitle>
            <CardDescription>
              비디오 생성을 위한 시나리오를 관리합니다
            </CardDescription>
          </div>
          <Button onClick={() => router.push('/scenarios/new')}>
            <Plus className="mr-2 h-4 w-4" />
            새 시나리오
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>프로젝트</TableHead>
              <TableHead>타입</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>버전</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  시나리오가 없습니다. 새 시나리오를 만들어보세요.
                </TableCell>
              </TableRow>
            ) : (
              scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {scenario.title}
                    </div>
                  </TableCell>
                  <TableCell>{scenario.project?.title || '-'}</TableCell>
                  <TableCell>{getTypeBadge(scenario.type)}</TableCell>
                  <TableCell>{getStatusBadge(scenario.status)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      v{scenario._count?.versions || 1}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(scenario.updatedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">메뉴 열기</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => router.push(`/scenarios/${scenario.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          편집
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleClone(scenario.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          복제
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/scenarios/${scenario.id}/video`)}
                        >
                          <Film className="mr-2 h-4 w-4" />
                          비디오 생성
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(scenario.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="text-sm text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              다음
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}