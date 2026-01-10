import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-toastify';
import { ArrowLeft, Mail, Save } from "lucide-react";
import { EMAIL_STORAGE_KEY } from '@/constants/storage';

const Settings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 从 localStorage 加载邮箱
    const savedEmail = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSave = () => {
    if (!email) {
      toast.error('请输入邮箱地址', {
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true
      });
      return;
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('请输入有效的邮箱地址', {
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true
      });
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
      toast.success('邮箱保存成功！', {
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true
      });
      // 延迟返回，让用户看到成功提示
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('保存邮箱失败:', error);
      toast.error('保存失败，请重试', {
        autoClose: 2000,
        closeOnClick: true,
        hideProgressBar: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>

        {/* 设置卡片 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Mail className="h-6 w-6 mr-2 text-blue-600" />
              通知设置
            </CardTitle>
            <CardDescription>
              设置您的邮箱地址以接收洗衣机完成通知
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                邮箱地址
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入您的邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base"
              />
              <p className="text-sm text-gray-500">
                当您订阅的洗衣机完成洗涤后，我们将向此邮箱发送通知
              </p>
            </div>

            {/* 保存按钮 */}
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? '保存中...' : '保存设置'}
            </Button>

            {/* 使用说明 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-sm mb-2 text-blue-900">使用说明</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 设置邮箱后，可以在机器详情页订阅通知</li>
                <li>• 当洗衣机完成洗涤时，您将收到邮件提醒</li>
                <li>• 同一台机器同一时间只能订阅一次</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;

