import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        graph: 'Graph',
        articles: 'Articles',
        problems: 'Problems',
      },
      home: {
        title: 'Visualize Your Knowledge',
        subtitle: 'Build your personal knowledge graph. Connect ideas, write articles, and solve problems with clarity.',
        login: 'Login / Register',
        enter: 'Enter My World',
        features: {
          graph: {
            title: 'Graph',
            desc: 'Visualize connections between your ideas.',
          },
          articles: {
            title: 'Articles',
            desc: 'Write and organize your thoughts.',
          },
          problems: {
            title: 'Problems',
            desc: 'Map out solutions step by step.',
          },
        },
      },
      graph: {
        title: 'Knowledge Graph',
        searchPlaceholder: 'Search graphs, articles, problems...',
        noResults: 'No results found',
        createNew: 'Create new graph "{{name}}"',
        editJson: 'Edit Graph JSON',
        editGraph: 'Edit Graph',
        saveChanges: 'Save Changes',
        invalidJson: 'Invalid JSON format',
        saveError: 'Failed to save graph',
        nodes: 'Nodes',
        edges: 'Edges',
        metadata: 'Metadata',
        addNode: 'Add Node',
        node: 'Node',
        addEdge: 'Add Edge',
        edge: 'Edge',
        source: 'Source Node ID',
        target: 'Target Node ID',
        label: 'Label',
        color: 'Color',
        linkUrl: 'Link URL',
        id: 'Graph ID / Filename',
        tags: 'Tags (comma separated)',
        aliases: 'Aliases (comma separated)',
        types: {
            graph: 'Graph',
            article: 'Article',
            problem: 'Problem'
        }
      },
      articles: {
        title: 'Articles',
        subtitle: 'Manage your knowledge base',
        newArticle: 'New Article',
        back: 'Back to Articles',
        save: 'Save',
        edit: 'Edit',
        placeholder: 'Write your article in Markdown...',
        titleLabel: 'Title',
        titlePlaceholder: 'Article Title',
        tagsLabel: 'Tags',
        tagsPlaceholder: 'tag1, tag2, tag3',
        aliasesLabel: 'Aliases',
        aliasesPlaceholder: 'alias1, alias2',
      },
      problems: {
        title: 'Problems',
        subtitle: 'Track solutions and learning paths',
        newProblem: 'New Problem',
        back: 'Back to Problems',
        saveContent: 'Save Content',
        editContent: 'Edit Content',
        description: 'Problem Description',
        solutionPath: 'Solution Path',
        addStep: 'Add Step',
        stepPlaceholder: 'Describe this step...',
        steps: 'steps',
        placeholder: 'Describe the problem in Markdown...',
        emptyScript: 'No steps added yet. Start by adding a solution step.',
      },
      auth: {
        loginTitle: 'Login',
        registerTitle: 'Create Account',
        username: 'Username',
        email: 'Email',
        emailOptional: 'Email (Optional)',
        emailPlaceholder: 'Defaults to username@example.com if empty',
        password: 'Password',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        loginFailed: 'Login failed',
        registerFailed: 'Registration failed',
      },
    },
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        graph: '图谱',
        articles: '文章',
        problems: '问题',
      },
      home: {
        title: '可视化你的知识',
        subtitle: '构建你的个人知识图谱。连接创意，撰写文章，清晰地解决问题。',
        login: '登录 / 注册',
        enter: '进入我的世界',
        features: {
          graph: {
            title: '知识图谱',
            desc: '可视化展示你想法之间的联系。',
          },
          articles: {
            title: '文章',
            desc: '撰写并整理你的思绪。',
          },
          problems: {
            title: '问题',
            desc: '逐步规划解决方案。',
          },
        },
      },
      graph: {
        title: '知识图谱',
        searchPlaceholder: '搜索图谱、文章、问题...',
        noResults: '未找到结果',
        createNew: '创建新图谱 "{{name}}"',
        editJson: '编辑图谱 JSON',
        editGraph: '编辑图谱',
        saveChanges: '保存更改',
        invalidJson: 'JSON 格式无效',
        saveError: '保存图谱失败',
        nodes: '节点',
        edges: '边',
        metadata: '元数据',
        addNode: '添加节点',
        node: '节点',
        addEdge: '添加边',
        edge: '边',
        source: '源节点 ID',
        target: '目标节点 ID',
        label: '标签',
        color: '颜色',
        linkUrl: '链接 URL',
        id: '图谱 ID / 文件名',
        tags: '标签 (逗号分隔)',
        aliases: '别名 (逗号分隔)',
        types: {
            graph: '图谱',
            article: '文章',
            problem: '问题'
        }
      },
      articles: {
        title: '文章',
        subtitle: '管理你的知识库',
        newArticle: '新建文章',
        back: '返回文章列表',
        save: '保存',
        edit: '编辑',
        placeholder: '用 Markdown 写文章...',
        titleLabel: '标题',
        titlePlaceholder: '文章标题',
        tagsLabel: '标签',
        tagsPlaceholder: '标签1, 标签2, 标签3',
        aliasesLabel: '别名',
        aliasesPlaceholder: '别名1, 别名2',
      },
      problems: {
        title: '问题',
        subtitle: '追踪解决方案和学习路径',
        newProblem: '新建问题',
        back: '返回问题列表',
        saveContent: '保存内容',
        editContent: '编辑内容',
        description: '问题描述',
        solutionPath: '解决路径',
        addStep: '添加步骤',
        stepPlaceholder: '描述此步骤...',
        steps: '步骤',
        placeholder: '用 Markdown 描述问题...',
        emptyScript: '尚未添加步骤。开始添加解决步骤吧。',
      },
      auth: {
        loginTitle: '登录',
        registerTitle: '创建账户',
        username: '用户名',
        email: '邮箱',
        emailOptional: '邮箱（可选）',
        emailPlaceholder: '如果为空，默认为 username@example.com',
        password: '密码',
        signIn: '登录',
        signUp: '注册',
        noAccount: '还没有账号？',
        hasAccount: '已经有账号了？',
        loginFailed: '登录失败',
        registerFailed: '注册失败',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
