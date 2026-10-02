import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const CONNECTOR_ID = '6abfde79d8be7526b2ac37fb';
const API_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Throws when the current app user has not connected their GitHub account
    const { accessToken } = await base44.asServiceRole.connectors.getCurrentAppUserConnection(CONNECTOR_ID);
    const headers = { ...API_HEADERS, Authorization: `Bearer ${accessToken}` };

    const profileRes = await fetch('https://api.github.com/user', { headers });
    if (!profileRes.ok) {
      return Response.json({ error: `GitHub API error (${profileRes.status})` }, { status: 502 });
    }
    const profile = await profileRes.json();

    const reposRes = await fetch('https://api.github.com/user/repos?sort=updated&per_page=20', { headers });
    const repos = reposRes.ok
      ? (await reposRes.json()).map((r) => ({
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          is_private: r.private,
          url: r.html_url,
          updated_at: r.updated_at,
        }))
      : [];

    return Response.json({
      profile: {
        login: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
        public_repos: profile.public_repos,
        url: profile.html_url,
      },
      repos,
    });
  } catch (error) {
    // Not connected (or any failure) — surfaced so the frontend shows the Connect button
    return Response.json({ error: error.message || 'Not connected' }, { status: 401 });
  }
}