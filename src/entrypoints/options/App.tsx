import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import "../global.css";
import { Octokit } from "octokit";
import { Check, X } from "lucide-react";

function OptionsApp() {
  const [form, setForm] = useState({
    owner: "",
    repo: "",
    token: ""
  });
  const [connectState, setConnectState] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [tokenMasked, setTokenMasked] = useState(false);

  // chrome对象声明，避免TS报错
  // @ts-ignore
  const chromeObj = typeof chrome !== 'undefined' ? chrome : undefined;

  // 读取已保存配置
  useEffect(() => {
    if (chromeObj && chromeObj.storage && chromeObj.storage.sync) {
      chromeObj.storage.sync.get([
        "githubConnected", "githubToken", "githubOwner", "githubRepo"
      ], (result: any) => {
        if (result.githubConnected) {
          setConnected(true);
          setForm({
            owner: result.githubOwner || "",
            repo: result.githubRepo || "",
            token: result.githubToken ? "******" : ""
          });
          setTokenMasked(!!result.githubToken);
        }
      });
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    // 如果token输入框被编辑，去掉掩码
    if (field === "token" && tokenMasked) {
      setTokenMasked(false);
    }
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleConnect = async () => {
    setLoading(true);
    setConnectState('idle');
    try {
      const octokit = new Octokit({ auth: form.token });
      // 验证token有效性
      await octokit.rest.users.getAuthenticated();
      // 验证是否能读取指定repo的issues
      await octokit.rest.issues.listForRepo({
        owner: form.owner,
        repo: form.repo,
        per_page: 1
      });
      setConnectState('success');
      // 保存到chrome.storage.sync
      if (chromeObj && chromeObj.storage && chromeObj.storage.sync) {
        chromeObj.storage.sync.set({
          githubToken: form.token,
          githubOwner: form.owner,
          githubRepo: form.repo,
          githubConnected: true
        });
      }
    } catch (e) {
      setConnectState('error');
      if (chromeObj && chromeObj.storage && chromeObj.storage.sync) {
        chromeObj.storage.sync.set({
          githubConnected: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-96 p-6 light">
      <form className="space-y-4">
        {/* Owner */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="owner">Owner</Label>
            <a href="https://github.com/join?source=login" className="text-xs text-blue-600 hover:underline">Join GitHub</a>
          </div>
          <Input
            id="owner"
            value={form.owner}
            onChange={e => handleChange("owner", e.target.value)}
            placeholder="st01cs"
          />
        </div>
        {/* Repo */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="repo">Repo</Label>
            <a href="https://github.com/login?return_to=%2Fst01cs%2Fbookmarkhub-template%2Fgenerate" className="text-xs text-blue-600 hover:underline">Create repo</a>
          </div>
          <Input
            id="repo"
            value={form.repo}
            onChange={e => handleChange("repo", e.target.value)}
            placeholder="bookmarks"
          />
        </div>
        {/* Token */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="token">Personal access token<span className="text-red-500">*</span></Label>
            <a href="https://github.com/settings/tokens/new" className="text-xs text-blue-600 hover:underline">Create token</a>
          </div>
          <Input
            id="token"
            type="password"
            value={form.token}
            onChange={e => handleChange("token", e.target.value)}
            placeholder=""
            autoComplete="off"
          />
          <div className="text-xs text-gray-500 mt-1 pl-1">* The <span className="font-mono">repo</span> scope is required.</div>
        </div>
        {/* Connect Button */}
        <div className="pt-2 flex justify-center">
          <Button type="button" className="w-full flex items-center justify-center gap-2" onClick={handleConnect} disabled={loading}>
            {connectState === 'success' && <Check className="h-4 w-4 text-green-600" />}
            {connectState === 'error' && <X className="h-4 w-4 text-red-600" />}
            <span className="underline decoration-dotted">Connect</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default OptionsApp; 