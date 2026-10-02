import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Github as GithubIcon, Link2, Unlink, RefreshCw, Star, Lock, Globe } from 'lucide-react';
import ModuleCard from '@/components/galaxium/ModuleCard';
import { Button } from '@/components/ui/button';

const CONNECTOR_ID = '6abfde79d8be7526b2ac37fb';

// Rule 2: reusable fetch — doubles as connection check AND data loader
const fetchGitHub = async () => {
  const res = await base44.functions.invoke('githubConnection', {});
  return res.data;
};

export default function GitHubPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);

  // Rule 1 + 2: check auth first, then fetch to detect connection status
  useEffect(() => {
    base44.auth.isAuthenticated().then(async (isAuth) => {
      setAuthed(isAuth);
      if (isAuth) {
        try {
          setData(await fetchGitHub());
          setConnected(true);
        } catch {
          setConnected(false);
        }
      }
      setLoading(false);
    });
  }, []);

  // Rule 3: open OAuth popup, poll for close, then re-fetch
  const handleConnect = async () => {
    const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const popup = window.open(url, '_blank');
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        setRefreshing(true);
        try {
          fetchGitHub().then((d) => {
            setData(d);
            setConnected(true);
          }).catch(() => setConnected(false));
        } finally {
          setRefreshing(false);
        }
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(CONNECTOR_ID);
    setConnected(false);
    setData(null);
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      setData(await fetchGitHub());
      setConnected(true);
    } catch {
      setConnected(false);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground font-mono text-sm">
        Checking GitHub connection…
      </div>
    );
  }

  if (!authed) {
    return (
      <ModuleCard title="GitHub Integration" icon={<GithubIcon size={16} className="text-primary" />}>
        <Button onClick={() => base44.auth.redirectToLogin()}>
          <Link2 size={16} /> Log in to connect GitHub
        </Button>
      </ModuleCard>
    );
  }

  return (
    <div className="space-y-6">
      <ModuleCard
        title="GitHub Integration"
        icon={<GithubIcon size={16} className="text-primary" />}
        headerContent={
          connected && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={refresh} disabled={refreshing}>
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDisconnect}>
                <Unlink size={14} /> Disconnect
              </Button>
            </div>
          )
        }
      >
        {connected ? (
          <div className="flex items-center gap-4">
            <img src={data.profile.avatar_url} alt="GitHub avatar" className="h-14 w-14 rounded-full border border-primary/40" />
            <div>
              <div className="font-display text-lg font-semibold">{data.profile.name || data.profile.login}</div>
              <a href={data.profile.url} target="_blank" rel="noreferrer" className="font-mono text-sm text-primary hover:underline">
                @{data.profile.login}
              </a>
              <div className="font-mono text-xs text-muted-foreground">{data.profile.public_repos} public repos</div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="font-mono text-sm text-muted-foreground">
              Connect your GitHub account to sync repos, issues and pull requests with Galaxium. Authorization opens in a new tab.
            </p>
            <Button onClick={handleConnect}>
              <Link2 size={16} /> Connect GitHub
            </Button>
          </div>
        )}
      </ModuleCard>

      {connected && data.repos.length > 0 && (
        <ModuleCard title={`Your Repositories (${data.repos.length})`} icon={<GithubIcon size={16} className="text-primary" />}>
          <div className="grid gap-3 md:grid-cols-2">
            {data.repos.map((repo) => (
              <a
                key={repo.full_name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border bg-accent/40 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-medium text-primary truncate">{repo.full_name}</span>
                  {repo.is_private ? <Lock size={12} className="shrink-0 text-muted-foreground" /> : <Globe size={12} className="shrink-0 text-muted-foreground" />}
                </div>
                {repo.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{repo.description}</p>}
                <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1"><Star size={11} /> {repo.stars}</span>
                </div>
              </a>
            ))}
          </div>
        </ModuleCard>
      )}
    </div>
  );
}