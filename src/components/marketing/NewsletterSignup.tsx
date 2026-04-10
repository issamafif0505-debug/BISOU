'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * Formulaire d'inscription newsletter — utilisé dans le Footer.
 * Actuellement : collecte l'e-mail et affiche un message de confirmation.
 * TODO (Phase 2) : connecter à un service e-mail (Mailchimp / Klaviyo).
 */
export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      return;
    }
    // TODO: call newsletter API
    setStatus('success');
    setEmail('');
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-green-400 font-sans">
        ✓ Bienvenue ! Vous recevrez nos prochaines nouveautés.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        type="email"
        placeholder="votre@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === 'error') setStatus('idle');
        }}
        aria-label="Adresse e-mail pour la newsletter"
        className="w-full"
      />
      {status === 'error' && (
        <p className="text-xs text-red-400 font-sans">Adresse e-mail invalide.</p>
      )}
      <Button type="submit" variant="secondary" size="sm" className="w-full">
        S&apos;inscrire
      </Button>
    </form>
  );
}

export default NewsletterSignup;
