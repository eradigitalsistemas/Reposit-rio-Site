import { Link } from 'react-router-dom'
import { Zap, MapPin, Phone, Mail, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react'
import React from 'react'

export function Footer({
  children,
  copyright,
}: {
  children: React.ReactNode
  copyright?: React.ReactNode
}) {
  return (
    <footer className="border-t bg-muted/20 pt-16 pb-8 mt-auto">
      <div className="container max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
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
        <h3 className="font-semibold text-foreground tracking-tight">{title}</h3>
      ) : (
        title
      )}
      <nav className="flex flex-col gap-3 text-sm text-muted-foreground">{children}</nav>
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
  const className = 'hover:text-primary transition-colors focus-visible:text-primary outline-none'
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
          className="flex items-center gap-2 hover:text-primary transition-colors focus-visible:text-primary outline-none"
        >
          <Phone className="h-4 w-4" />
          <span>{wa.label}</span>
        </a>
      ))}
      {phone && (
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="flex items-center gap-2 hover:text-primary transition-colors focus-visible:text-primary outline-none"
        >
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </a>
      )}
      {email && (
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-2 hover:text-primary transition-colors focus-visible:text-primary outline-none"
        >
          <Mail className="h-4 w-4" />
          <span className="truncate">{email}</span>
        </a>
      )}
      {address && (
        <div className="flex items-start gap-3 mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
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
    <div className="flex flex-col gap-3">
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none"
          aria-label="Instagram"
        >
          <Instagram className="h-4 w-4" />
          <span>{instagram}</span>
        </a>
      )}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none"
          aria-label="Facebook"
        >
          <Facebook className="h-4 w-4" />
          <span>Facebook</span>
        </a>
      )}
      {twitter && (
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none"
          aria-label="Twitter"
        >
          <Twitter className="h-4 w-4" />
          <span>Twitter</span>
        </a>
      )}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors focus-visible:text-primary outline-none"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
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
          <Link to="/" className="flex items-center gap-2 mb-2" aria-label="Era Digital Home">
            <div className="bg-primary p-1.5 rounded-lg">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Era Digital</span>
          </Link>
        }
      >
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-2">
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
            { label: 'WhatsApp Comercial', number: '5589999999999' },
            { label: 'WhatsApp Suporte', number: '5589999999998' },
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
