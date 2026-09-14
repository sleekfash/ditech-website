import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Plus, Edit, Trash2, LogOut, FileText, Users, MessageSquare, LayoutDashboard, Eye, Bot, ShoppingBag, UserCog } from "lucide-react";
import OrckaAdmin from "@/components/admin/OrckaAdmin";
import ProductsAdmin from "@/components/admin/ProductsAdmin";
import AccountPanel from "@/components/admin/AccountPanel";
import ditechLogo from "@/assets/ditech-logo.jpeg";
import type { User, Session } from "@supabase/supabase-js";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  published: boolean | null;
  created_at: string;
  read_time: number | null;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  status: string | null;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    published: false,
    read_time: 5,
  });

  useEffect(() => {
    const checkAdminAccess = async (session: Session | null) => {
      if (!session) {
        navigate("/auth");
        return;
      }

      setSession(session);
      setUser(session.user);

      // Verify the user is an admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", session.user.id)
        .single();

      if (!profile?.is_admin) {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
      fetchPosts();
      fetchContacts();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      // Re-check admin on auth state change
      checkAdminAccess(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminAccess(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      setContacts(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      published: false,
      read_time: 5,
    });
    setEditingPost(null);
  };

  const handleCreatePost = async () => {
    if (!formData.title || !formData.content || !formData.slug) {
      toast({
        title: "Error",
        description: "Title, slug, and content are required",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      ...formData,
      author_id: user?.id,
    };

    const { error } = await supabase.from("blog_posts").insert([postData]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      fetchPosts();
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        published: formData.published,
        read_time: formData.read_time,
      })
      .eq("id", editingPost.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      fetchPosts();
    }
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Blog post deleted",
      });
      fetchPosts();
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      category: post.category || "",
      published: post.published || false,
      read_time: post.read_time || 5,
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    { label: "Total Posts", value: posts.length, icon: FileText },
    { label: "Published", value: posts.filter(p => p.published).length, icon: Eye },
    { label: "Contacts", value: contacts.length, icon: MessageSquare },
    { label: "New Inquiries", value: contacts.filter(c => c.status === "new").length, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ditechLogo} alt="DiTech" className="h-10 w-10 rounded-lg" />
            <span className="font-display font-bold text-xl">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "posts", label: "Blog Posts", icon: FileText },
            { id: "contacts", label: "Contact Submissions", icon: MessageSquare },
            { id: "orcka", label: "Orcka AI", icon: Bot },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "gradient-bg" : ""}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-display font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className="h-10 w-10 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common admin tasks</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={() => { setActiveTab("posts"); setIsDialogOpen(true); }} className="gradient-bg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Blog Post
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("contacts")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Inquiries
                </Button>
                <Button variant="outline" asChild>
                  <a href="/" target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    View Website
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blog Posts */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Blog Posts</h2>
              <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button className="gradient-bg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
                    <DialogDescription>
                      {editingPost ? "Update your blog post details" : "Add a new blog post to your website"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Post title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="post-url-slug"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="AI Insights"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="readTime">Read Time (min)</Label>
                        <Input
                          id="readTime"
                          type="number"
                          value={formData.read_time}
                          onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Brief description..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Write your blog post content..."
                        rows={8}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={editingPost ? handleUpdatePost : handleCreatePost}
                        className="gradient-bg"
                      >
                        {editingPost ? "Update" : "Create"} Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No blog posts yet. Create your first post!
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.category || "Uncategorized"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={post.published ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(post)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* Contact Submissions */}
        {activeTab === "contacts" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Contact Submissions</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No contact submissions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.company || "-"}</TableCell>
                        <TableCell>
                          <Badge className={contact.status === "new" ? "bg-blue-500/10 text-blue-600" : "bg-gray-500/10 text-gray-600"}>
                            {contact.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* Orcka AI control dashboard */}
        {activeTab === "orcka" && (
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Orcka AI Assistant</h2>
            <OrckaAdmin />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
