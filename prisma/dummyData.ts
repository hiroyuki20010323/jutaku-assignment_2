import { Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const ADMIN_USER = {
  id: "f66abc97-fb46-476a-b6cc-5c5141fcf99c",
  name: "管理者",
  email: "admin@test.com",
  role: Role.ADMIN
};

// 一般ユーザーデータ（3件）
export const USERS = [
  {
    id: uuidv4(),
    name: "山田太郎",
    email: "yamada@example.com",
    role: Role.USER
  },
  {
    id: uuidv4(),
    name: "佐藤花子",
    email: "sato@example.com",
    role: Role.USER
  },
  {
    id: uuidv4(),
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: Role.USER
  }
];

// プロジェクトデータ（3件）
export const PROJECTS = [
  {
    id: uuidv4(),
    summary: "ECサイトリニューアルプロジェクト",
    deadline: new Date("2025-12-31T23:59:59Z"),
    unitPrice: 800000
  },
  {
    id: uuidv4(),
    summary: "社内管理システム開発",
    deadline: new Date("2025-11-30T23:59:59Z"),
    unitPrice: 650000
  },
  {
    id: uuidv4(),
    summary: "モバイルアプリ開発プロジェクト",
    deadline: new Date("2025-05-15T23:59:59Z"),
    unitPrice: 950000
  }
];

// スキルデータ（3件）
export const SKILLS = [
  {
   
    skillName: "React"
  },
  {
   
    skillName: "Next.js"
  },
  {
   
    skillName: "AWS"
  }
];