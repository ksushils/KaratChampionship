/* Payload admin login/branding logo. */
export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/karat-k.png" alt="" width={56} height={53} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: '0.16em', color: '#dcb35c' }}>KARAT</div>
        <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.42em', color: '#8db4ff', marginTop: 4 }}>RACING · CMS</div>
      </div>
    </div>
  )
}
