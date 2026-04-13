import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'
import React from 'react'
import logoUrl from '@/assets/logo-principal-preto-sem-fundo-93506.png'

export function Footer({
  children,
  copyright,
}: {
  children: React.ReactNode
  copyright?: React.ReactNode
}) {
  return (
    <footer className="border-t bg-muted/20 pt-12 md:pt-16 pb-8 mt-auto relative z-10">
      <div className="container max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {children}
        </div>
        {copyright}
      </div>
    </footer>
  )
}

export function FooterColumn({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      {typeof title === 'string' ? (
        <h3 className="font-semibold text-foreground tracking-tight text-lg md:text-base">
          {title}
        </h3>
      ) : (
        title
      )}
      <nav className="flex flex-col gap-2 md:gap-3 text-base md:text-sm text-muted-foreground">
        {children}
      </nav>
    </div>
  )
}

export function FooterLink({
  href,
  children,
  external,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  const className =
    'py-2 md:py-1 hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10'
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export function ContactInfo({
  address,
  phone,
  email,
  whatsapp,
}: {
  address?: React.ReactNode
  phone?: string
  email?: string
  whatsapp?: string | { label: string; number: string }[]
}) {
  const waLinks =
    typeof whatsapp === 'string' ? [{ label: 'WhatsApp', number: whatsapp }] : whatsapp || []
  return (
    <>
      {waLinks.map((wa, i) => (
        <a
          key={i}
          href={`https://wa.me/${wa.number.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2 md:py-1 hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label={`Contato via WhatsApp: ${wa.label}`}
        >
          <Phone className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span className="text-base md:text-sm">{wa.label}</span>
        </a>
      ))}
      {phone && (
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="flex items-center gap-3 py-2 md:py-1 hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label={`Ligar para ${phone}`}
        >
          <Phone className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span className="text-base md:text-sm">{phone}</span>
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3 py-2 md:py-1 hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label={`Enviar e-mail para ${email}`}
        >
          <Mail className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span className="truncate text-base md:text-sm">{email}</span>
        </a>
      )}
      {address && (
        <div className="flex items-start gap-3 py-2 md:py-1 mt-2 text-base md:text-sm text-muted-foreground">
          <MapPin
            className="h-5 w-5 md:h-4 md:w-4 mt-0.5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <span>{address}</span>
        </div>
      )}
    </>
  )
}

export function SocialLinks({
  instagram,
  facebook,
  linkedin,
  twitter,
}: {
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2 md:py-1 text-base md:text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label={`Siga-nos no Instagram: ${instagram}`}
        >
          <Instagram className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span>{instagram}</span>
        </a>
      )}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2 md:py-1 text-base md:text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label="Siga-nos no Facebook"
        >
          <Facebook className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span>Facebook</span>
        </a>
      )}
      {twitter && (
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2 md:py-1 text-base md:text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label="Siga-nos no Twitter"
        >
          <Twitter className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span>Twitter</span>
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 py-2 md:py-1 text-base md:text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none relative z-10"
          aria-label="Siga-nos no LinkedIn"
        >
          <Linkedin className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
      )}
    </div>
  )
}

export function LegalLinks({ items }: { items: { label: string; href: string }[] }) {
  return (
    <>
      {items.map((item, i) => (
        <FooterLink key={i} href={item.href}>
          {item.label}
        </FooterLink>
      ))}
    </>
  )
}

export function Copyright({ year, company }: { year: number; company: string }) {
  return (
    <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-sm text-muted-foreground">
      <p>
        &copy; {year} {company}. Todos os direitos reservados.
      </p>
      <p className="flex items-center gap-1.5 justify-center">
        Protegido e em conformidade com a LGPD.
      </p>
    </div>
  )
}

export function SiteFooter() {
  return (
    <Footer copyright={<Copyright year={2024} company="Era Digital" />}>
      <FooterColumn
        title={
          <Link
            to="/"
            className="flex items-center gap-2 mb-2 focus-visible:outline-primary py-2 md:py-0 relative z-10"
            aria-label="Era Digital - Voltar para a página inicial"
          >
            <img
              src={logoUrl}
              alt="Era Digital Logo"
              className="h-8 w-auto object-contain"
              aria-hidden="true"
            />
            <span className="font-bold text-xl md:text-lg tracking-tight">Era Digital</span>
          </Link>
        }
      >
        <p className="text-base md:text-sm text-muted-foreground leading-relaxed max-w-xs mb-2">
          Transformando processos gerenciais com tecnologia, eficiência e inovação para o seu
          negócio.
        </p>
        <ContactInfo
          address={
            <>
              Rua Fernando Drumont, 815
              <br />
              Centro, Floriano/PI
            </>
          }
        />
      </FooterColumn>

      <FooterColumn title="Nossas Soluções">
        <FooterLink href="/certificados">Certificados Digitais</FooterLink>
        <FooterLink href="/erp">Sistemas ERP</FooterLink>
        <FooterLink href="/talentos">Banco de Talentos</FooterLink>
        <FooterLink href="/base-conhecimento">Base de Conhecimento</FooterLink>
        <FooterLink href="/faq">Perguntas Frequentes</FooterLink>
      </FooterColumn>

      <FooterColumn title="Fale Conosco">
        <ContactInfo
          whatsapp={[
            { label: 'WhatsApp Comercial', number: '558999380203' },
            { label: 'WhatsApp Suporte', number: '558994184931' },
          ]}
          email="comercial@areradigital.com.br"
        />
      </FooterColumn>

      <FooterColumn title="Redes Sociais">
        <SocialLinks instagram="@eradigitalsistemas" />
        <h3 className="font-semibold text-foreground mt-4 tracking-tight">Legal</h3>
        <LegalLinks
          items={[
            { label: 'Políticas de Privacidade', href: '/politicas' },
            { label: 'Termos de Uso', href: '/termos' },
          ]}
        />
      </FooterColumn>
    </Footer>
  )
}
