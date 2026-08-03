import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { changePassword } from "../actions";

export const metadata = { title: "修改密碼" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { user } = await requireAdmin();
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-5 py-14">
      <Link href="/admin" className="sans text-sm">← 返回管理中心</Link>
      <p className="eyebrow mt-9">ACCOUNT SECURITY</p>
      <h1 className="mt-3 text-4xl">修改登入密碼</h1>
      <p className="sans mt-4 text-sm text-[#596258]">登入帳號：{user.email}</p>

      {error && (
        <p className="sans mt-6 border border-red-700/30 p-4 text-sm text-red-900">
          {error}
        </p>
      )}

      <form action={changePassword} className="card sans mt-8 space-y-5 p-6">
        <label className="block text-sm">
          新密碼
          <input
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className="field"
          />
        </label>
        <label className="block text-sm">
          再輸入一次新密碼
          <input
            name="password_confirmation"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className="field"
          />
        </label>
        <p className="text-xs leading-6 text-[#6d706b]">
          請使用至少 10 個字元，建議混合英文字母、數字與符號。修改後會自動登出。
        </p>
        <button className="w-full bg-[#34423a] px-5 py-3 text-white">儲存新密碼</button>
      </form>
    </div>
  );
}
