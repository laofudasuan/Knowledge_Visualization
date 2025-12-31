# 知识图谱系统 - 后端API接口文档

## 1. 接口概述

### 1.1 基本信息
- **Base URL**: `http://localhost:3001/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 认证机制
所有需要认证的接口都需要在请求头中包含：
```
Authorization: Bearer {jwt_token}
```

## 2. 用户认证接口

### 2.1 用户注册
```
POST /auth/register
```

**请求参数：**
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| email | string | 是 | 用户邮箱地址 |
| password | string | 是 | 用户密码（至少6位） |
| name | string | 是 | 用户昵称 |

**请求示例：**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "name": "张三"
}
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "张三"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应失败：**
```json
{
  "success": false,
  "error": "邮箱已存在"
}
```

### 2.2 用户登录
```
POST /auth/login
```

**请求参数：**
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| email | string | 是 | 用户邮箱地址 |
| password | string | 是 | 用户密码 |

**请求示例：**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "张三"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. 知识图谱接口

### 3.1 获取用户所有图谱
```
GET /graphs
```

**响应成功：**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "filename": "root.json",
      "title": "根图谱",
      "tags": ["基础", "核心"],
      "aliases": ["root", "main"],
      "cssclasses": "graph-style",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 3.2 获取特定图谱内容
```
GET /graphs/:id
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "filename": "root.json",
    "content": {
      "tags": ["基础", "核心"],
      "aliases": ["root", "main"],
      "cssclasses": "graph-style",
      "nodes": [
        {
          "id": "node1",
          "label": "数学",
          "color": "#ff6b6b",
          "x": 0,
          "y": 0,
          "link": {
            "url": "/articles/math-article",
            "type": "internal"
          }
        }
      ],
      "edges": [
        {
          "source": "node1",
          "target": "node2",
          "label": "相关"
        }
      ]
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.3 创建新图谱
```
POST /graphs
```

**请求参数：**
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| filename | string | 是 | 图谱文件名 |
| content | object | 是 | 图谱内容 |

**请求示例：**
```json
{
  "filename": "new_graph.json",
  "content": {
    "tags": [],
    "aliases": [],
    "cssclasses": "default",
    "nodes": [],
    "edges": []
  }
}
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "filename": "new_graph.json",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.4 更新图谱
```
PUT /graphs/:id
```

**请求参数：**
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| content | object | 是 | 图谱内容 |

**请求示例：**
```json
{
  "content": {
    "tags": ["更新"],
    "aliases": ["updated"],
    "cssclasses": "graph-style",
    "nodes": [
      {
        "id": "node1",
        "label": "更新节点",
        "color": "#00ff00"
      }
    ],
    "edges": []
  }
}
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

## 4. 文章接口

### 4.1 获取用户所有文章
```
GET /articles
```

**响应成功：**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "filename": "welcome.md",
      "title": "欢迎使用知识图谱",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 4.2 获取文章内容
```
GET /articles/:id
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "filename": "welcome.md",
    "title": "欢迎使用知识图谱",
    "content": "# 欢迎使用知识图谱\n\n这是您的个人知识库...",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4.3 创建/更新文章
```
POST /articles
PUT /articles/:id
```

**请求参数：**
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| filename | string | 是 | 文章文件名 |
| title | string | 是 | 文章标题 |
| content | string | 是 | Markdown内容 |

**请求示例：**
```json
{
  "filename": "new_article.md",
  "title": "新文章",
  "content": "# 新文章\n\n文章内容..."
}
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "filename": "new_article.md",
    "title": "新文章",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

## 5. 问题接口

### 5.1 获取用户所有问题
```
GET /problems
```

**响应成功：**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "filename": "problem1",
      "title": "算法问题",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 5.2 获取问题详情
```
GET /problems/:id
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "filename": "problem1",
    "title": "算法问题",
    "content": "# 问题描述\n\n这是一个算法问题...",
    "solutionScript": {
      "steps": [
        {
          "stepId": "step1",
          "description": "初始化节点",
          "targetNodeId": "node1",
          "highlightNodes": ["node1", "node2"],
          "highlightEdges": [{"source": "node1", "target": "node2"}],
          "duration": 2000
        }
      ]
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.3 创建/更新问题
```
POST /problems
PUT /problems/:id
```

**请求参数：**
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| filename | string | 是 | 问题文件名 |
| title | string | 是 | 问题标题 |
| content | string | 是 | Markdown内容 |
| solutionScript | object | 是 | 动画脚本 |

**请求示例：**
```json
{
  "filename": "new_problem",
  "title": "新问题",
  "content": "# 问题描述\n\n问题内容...",
  "solutionScript": {
    "steps": [
      {
        "stepId": "step1",
        "description": "第一步",
        "duration": 1000
      }
    ]
  }
}
```

**响应成功：**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "filename": "new_problem",
    "title": "新问题",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

## 6. 搜索接口

### 6.1 全局搜索
```
GET /search?q={keyword}
```

**响应成功：**
```json
{
  "success": true,
  "data": [
    {
      "type": "graph",
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "根图谱",
      "matchField": "filename"
    },
    {
      "type": "article",
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "title": "欢迎使用知识图谱",
      "matchField": "title"
    },
    {
      "type": "problem",
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "title": "算法问题",
      "matchField": "title"
    }
  ]
}
```

## 7. 数据模型定义

### 7.1 图谱节点 (GraphNode)
```typescript
interface GraphNode {
  id: string;           // 节点唯一标识
  label?: string;       // 显示标签（可选）
  color?: string;       // 节点颜色（可选）
  x?: number;          // X坐标（可选）
  y?: number;          // Y坐标（可选）
  link?: {             // 链接信息（可选）
    url: string;       // 链接地址
    type: 'internal' | 'external'; // 链接类型
  };
}
```

### 7.2 图谱边 (GraphEdge)
```typescript
interface GraphEdge {
  source: string;       // 源节点ID
  target: string;       // 目标节点ID
  label?: string;       // 边标签（可选）
}
```

### 7.3 图谱数据 (GraphData)
```typescript
interface GraphData {
  id: string;           // 图谱唯一标识
  tags: string[];       // 标签数组
  aliases: string[];    // 别名数组
  cssclasses?: string;  // CSS类名（可选）
  nodes: GraphNode[];   // 节点数组
  edges: GraphEdge[];   // 边数组
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
}
```

### 7.4 文章 (Article)
```typescript
interface Article {
  id: string;           // 文章唯一标识
  title: string;        // 文章标题
  content: string;      // Markdown内容
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
}
```

### 7.5 动画步骤 (AnimationStep)
```typescript
interface AnimationStep {
  stepId: string;                    // 步骤ID
  description: string;               // 步骤描述
  targetNodeId?: string;             // 目标节点ID（可选）
  highlightNodes?: string[];         // 高亮节点数组（可选）
  highlightEdges?: {                 // 高亮边数组（可选）
    source: string;
    target: string;
  }[];
  duration?: number;                 // 持续时间（毫秒，可选）
}
```

### 7.6 问题 (Problem)
```typescript
interface Problem {
  id: string;                    // 问题唯一标识
  title: string;                 // 问题标题
  content: string;              // Markdown内容
  solutionScript: {              // 解决方案脚本
    steps: AnimationStep[];       // 动画步骤数组
  };
  createdAt: string;             // 创建时间
  updatedAt: string;              // 更新时间
}
```

### 7.7 搜索结果 (SearchResult)
```typescript
type SearchResult = {
  type: 'graph' | 'article' | 'problem';  // 结果类型
  id: string;                              // 结果ID
  title: string;                           // 结果标题
  matchField?: string;                     // 匹配字段（可选）
};
```

## 8. 错误响应格式

所有接口在失败时返回统一的错误格式：
```json
{
  "success": false,
  "error": "错误描述信息",
  "code": "ERROR_CODE"  // 可选的错误代码
}
```

## 9. HTTP状态码

- **200**: 请求成功
- **201**: 创建成功
- **400**: 请求参数错误
- **401**: 未认证/认证失败
- **403**: 无权限访问
- **404**: 资源不存在
- **500**: 服务器内部错误

## 10. 接口优先级建议

### 高优先级（MVP必需）
1. 用户注册/登录接口
2. 图谱列表和获取接口
3. 文章列表和获取接口
4. 问题列表和获取接口

### 中优先级（核心功能）
1. 图谱创建/更新接口
2. 文章创建/更新接口
3. 问题创建/更新接口
4. 搜索接口

### 低优先级（增强功能）
1. 批量操作接口
2. 数据导出接口
3. 高级搜索过滤接口