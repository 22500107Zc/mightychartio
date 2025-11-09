import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MessageSquare, Send, ThumbsUp, User, Trash2, Crown } from "lucide-react";

interface Feedback {
  id: string;
  user_id: string;
  title: string;
  message: string;
  upvotes: number;
  created_at: string;
  display_name: string;
  isAdmin?: boolean;
}

export default function Feedback() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    if (user) {
      fetchDisplayName();
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      if (!error) {
        setIsCurrentUserAdmin(data || false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchDisplayName = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user?.id)
        .single();

      if (!error && data) {
        setDisplayName(data.display_name || "Anonymous");
      }
    } catch (error) {
      console.error("Error fetching display name:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch admin status for each feedback author
      const feedbacksWithRoles = await Promise.all(
        (data || []).map(async (feedback) => {
          try {
            const { data: roleData } = await supabase.rpc('has_role', {
              _user_id: feedback.user_id,
              _role: 'admin'
            });
            return { ...feedback, isAdmin: roleData || false };
          } catch {
            return { ...feedback, isAdmin: false };
          }
        })
      );
      
      setFeedbacks(feedbacksWithRoles);
    } catch (error: any) {
      console.error("Error fetching feedback:", error);
    }
  };

  const containsProfanity = (text: string): boolean => {
    const profanityList = [
      "fuck", "shit", "damn", "bitch", "ass", "dick", "pussy", "cock", 
      "bastard", "cunt", "whore", "slut", "piss", "fag", "nigger", "nigga"
    ];
    const lowerText = text.toLowerCase();
    return profanityList.some(word => lowerText.includes(word));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to submit feedback");
      return;
    }

    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (containsProfanity(title) || containsProfanity(message)) {
      toast.error("Please keep your feedback professional and respectful");
      return;
    }

    if (title.length > 100) {
      toast.error("Title must be 100 characters or less");
      return;
    }

    if (message.length > 500) {
      toast.error("Message must be 500 characters or less");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("feedback").insert({
        user_id: user.id,
        title: title.trim(),
        message: message.trim(),
        display_name: displayName || "Anonymous",
        upvotes: 0
      });

      if (error) throw error;

      toast.success("Feedback submitted successfully!");
      setTitle("");
      setMessage("");
      fetchFeedbacks();
    } catch (error: any) {
      toast.error("Failed to submit feedback");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (feedbackId: string) => {
    if (!user) {
      toast.error("Please sign in to upvote");
      return;
    }

    try {
      const feedback = feedbacks.find(f => f.id === feedbackId);
      if (!feedback) return;

      const { error } = await supabase
        .from("feedback")
        .update({ upvotes: feedback.upvotes + 1 })
        .eq("id", feedbackId);

      if (error) throw error;

      toast.success("Upvoted!");
      fetchFeedbacks();
    } catch (error: any) {
      toast.error("Failed to upvote");
      console.error("Error:", error);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!isCurrentUserAdmin) {
      toast.error("Only admins can delete feedback");
      return;
    }

    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", feedbackId);

      if (error) throw error;

      toast.success("Feedback deleted");
      fetchFeedbacks();
    } catch (error: any) {
      toast.error("Failed to delete feedback");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="purple-overlay" />
      <div className="content-wrapper flex-1">
        <Navbar />
        
        <div className="container mx-auto px-4 md:px-6 pt-24 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                Community <span className="text-primary">Feedback</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Help us shape the future of MightyChart by sharing your ideas and suggestions
              </p>
            </div>

            {user && (
              <Card className="mb-12 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Submit Feedback
                  </CardTitle>
                  <CardDescription className="text-base">
                    Share features you'd like to see or improvements we can make
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-base">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Brief title for your feedback"
                        maxLength={100}
                        className="mt-2 text-base h-12"
                      />
                      <p className="text-sm text-muted-foreground mt-1">{title.length}/100</p>
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-base">Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your feedback in detail..."
                        maxLength={500}
                        rows={5}
                        className="mt-2 text-base"
                      />
                      <p className="text-sm text-muted-foreground mt-1">{message.length}/500</p>
                    </div>
                    <Button type="submit" disabled={loading} size="lg" className="w-full text-base">
                      {loading ? "Submitting..." : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="mb-12 bg-primary/10 border-primary/30">
                <CardContent className="py-8 text-center">
                  <p className="text-lg text-muted-foreground mb-4">
                    Sign in to submit feedback and help shape MightyChart
                  </p>
                  <Button onClick={() => window.location.href = "/auth"} size="lg">
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="text-3xl font-bold mb-6">Recent Feedback</h2>
              <div className="space-y-4">
                {feedbacks.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-lg text-muted-foreground">
                        No feedback yet. Be the first to share your ideas!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  feedbacks.map((feedback) => (
                    <Card key={feedback.id} className="bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{feedback.title}</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="w-4 h-4" />
                              <span className="flex items-center gap-2">
                                {feedback.display_name}
                                {feedback.isAdmin && (
                                  <span 
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold cursor-help"
                                    title="Founder & CEO of MightyChart"
                                  >
                                    <Crown className="w-3 h-3" />
                                    Founder
                                  </span>
                                )}
                              </span>
                              <span>•</span>
                              <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpvote(feedback.id)}
                              disabled={!user}
                              className="flex items-center gap-2"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="font-semibold">{feedback.upvotes}</span>
                            </Button>
                            {isCurrentUserAdmin && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(feedback.id)}
                                className="flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-base text-muted-foreground leading-relaxed">{feedback.message}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
