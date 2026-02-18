// Auth Protection Script
// Include this in any page that needs authentication

import { SUPABASE_URL, SUPABASE_ANON_KEY, ALLOWED_EMAILS, ALLOWED_DOMAINS } from './config.js';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function isEmailAllowed(email) {
    if (ALLOWED_EMAILS.length === 0 && ALLOWED_DOMAINS.length === 0) {
        return true;
    }
    if (ALLOWED_EMAILS.includes(email.toLowerCase())) {
        return true;
    }
    const domain = email.split('@')[1];
    if (ALLOWED_DOMAINS.includes(domain)) {
        return true;
    }
    return false;
}

function getLoginUrl() {
    // Calculate relative path to auth/login.html from current page
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    let prefix = '';
    for (let i = 0; i < depth; i++) {
        prefix += '../';
    }
    return prefix + 'auth/login.html?redirect=' + encodeURIComponent(window.location.href);
}

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = getLoginUrl();
        return false;
    }

    if (!isEmailAllowed(session.user.email)) {
        await supabase.auth.signOut();
        window.location.href = getLoginUrl();
        return false;
    }

    // Show the page content
    document.body.style.visibility = 'visible';
    return true;
}

// Hide content until authenticated
document.body.style.visibility = 'hidden';

// Check auth on page load
checkAuth();

// Export for use in pages
export { supabase, checkAuth };
