import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Crown } from 'lucide-react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';

const displayNameSchema = z.string()
  .trim()
  .min(1, 'Name cannot be empty')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_$€£¥*+]+$/, 'Only letters, numbers, spaces, hyphens, underscores and $€£¥*+ allowed');

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, language')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setLanguage(profile.language || 'en');
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();
      
      setIsAdmin(!!roleData);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    // Validate display name
    const validation = displayNameSchema.safeParse(displayName);
    if (!validation.success) {
      toast({
        title: "Invalid display name",
        description: validation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }
    
    // Validate language
    if (!['en', 'es'].includes(language)) {
      toast({
        title: "Invalid language",
        description: "Please select a valid language",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          display_name: displayName.trim(), 
          language: language 
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="purple-overlay" />
        <div className="content-wrapper">
          <Navbar />
          <div className="container mx-auto px-4 pt-24">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">Settings</h1>
            {isAdmin && (
              <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 px-3 py-1 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                Founder
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">Manage your account preferences</p>
        </div>

        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>
            </CardContent>
          </Card>

          <Button onClick={saveSettings} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
