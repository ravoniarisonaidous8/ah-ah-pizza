import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Menu as MenuIcon,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import {
  menuProducts,
  siteConfig,
  type MenuCategory,
  type MenuProduct,
} from "./config/site";
import {
  addCartLine,
  cartCount,
  cartSubtotal,
  changeQuantity,
  createWhatsAppMessage,
  createWhatsAppUrl,
  formatAriary,
  removeCartLine,
  type CartLine,
} from "./lib/cart";

const categoryFilters: ("Tout" | MenuCategory)[] = ["Tout", ...siteConfig.menuCategories];

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand-mark${light ? " brand-mark-light" : ""}`} href="#accueil" aria-label={`${siteConfig.name} — accueil`}>
      <span className="brand-stamp" aria-hidden="true">
        OH!
      </span>
      <span className="brand-wording">
        <span>LA! LA</span>
        <span className="brand-pizza">PIZZA'S</span>
      </span>
    </a>
  );
}

function WhatsAppLink({ children, className }: { children: ReactNode; className: string }) {
  const message = "Bonjour, je souhaite me renseigner sur le menu et les modalités de Oh! La! La Pizza's.";
  return (
    <a
      className={className}
      href={createWhatsAppUrl(siteConfig.whatsappNumber, message)}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter Oh! La! La Pizza's sur WhatsApp — une nouvelle fenêtre s'ouvrira"
    >
      {children}
    </a>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: MenuProduct;
  onAdd: (line: Omit<CartLine, "key" | "quantity">) => void;
}) {
  const [sizeId, setSizeId] = useState(product.sizes[0].id);
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const selectedSize = product.sizes.find((size) => size.id === sizeId) ?? product.sizes[0];
  const selectedExtras = product.extras.filter((extra) => selectedExtraIds.includes(extra.id));
  const displayedPrice =
    selectedSize.priceAr + selectedExtras.reduce((total, extra) => total + extra.priceAr, 0);

  function toggleExtra(id: string) {
    setSelectedExtraIds((current) =>
      current.includes(id) ? current.filter((extraId) => extraId !== id) : [...current, id],
    );
  }

  function handleAdd() {
    onAdd({
      productId: product.id,
      name: product.name,
      size: selectedSize,
      extras: selectedExtras,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="menu-card">
      <div className="menu-card-photo">
        <img src={product.image} alt={product.imageAlt} loading="lazy" />
        {siteConfig.demoMode && product.isExample && <span className="example-stamp">EXEMPLE</span>}
        <span className="photo-index" aria-hidden="true">
          {String(menuProducts.findIndex((item) => item.id === product.id) + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="menu-card-copy">
        <div className="menu-card-eyebrow">
          <span>{product.category}</span>
          {siteConfig.demoMode && product.isExample && (
            <>
              <span className="example-dot">·</span>
              <span>Démo</span>
            </>
          )}
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <label className="option-field">
          <span>
            Format {siteConfig.demoMode && product.isExample && <small>(exemple)</small>}
          </span>
          <select value={sizeId} onChange={(event) => setSizeId(event.target.value)}>
            {product.sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.label}
              </option>
            ))}
          </select>
        </label>

        {product.extras.length > 0 && (
          <details className="extras-picker">
            <summary>Choisir un supplément <span>+</span></summary>
            <div className="extras-list">
              {product.extras.map((extra) => (
                <label className="extra-option" key={extra.id}>
                  <input
                    type="checkbox"
                    checked={selectedExtraIds.includes(extra.id)}
                    onChange={() => toggleExtra(extra.id)}
                  />
                  <span>{extra.label}</span>
                  <small>+ {formatAriary(extra.priceAr)}</small>
                </label>
              ))}
            </div>
          </details>
        )}

        <div className="menu-card-action">
          <p className="demo-price">
            {siteConfig.demoMode && product.isExample
              ? formatAriary(displayedPrice)
              : siteConfig.pricesVerified
                ? formatAriary(displayedPrice)
                : "Prix à confirmer"}
            {siteConfig.demoMode && product.isExample && <span>tarif fictif</span>}
          </p>
          <button
            className={`add-button${added ? " is-added" : ""}`}
            onClick={handleAdd}
            type="button"
            aria-label={`Ajouter ${product.name}, ${selectedSize.label}, au panier`}
          >
            {added ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
            <span>{added ? "Ajouté" : "Ajouter"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function CartDialog({
  dialogRef,
  lines,
  onClose,
  onChangeQuantity,
  onRemove,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  lines: CartLine[];
  onClose: () => void;
  onChangeQuantity: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
}) {
  const [previewing, setPreviewing] = useState(false);
  const [draft, setDraft] = useState("");
  const count = cartCount(lines);
  const subtotal = cartSubtotal(lines);
  const message = createWhatsAppMessage(
    lines,
    siteConfig.pricesVerified && !siteConfig.demoMode,
  );

  useEffect(() => {
    if (!previewing) setDraft(message);
  }, [message, previewing]);

  function goToPreview() {
    setDraft(message);
    setPreviewing(true);
  }

  function goBack() {
    setPreviewing(false);
  }

  function closeDialog() {
    setPreviewing(false);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const editedMessage = String(data.get("message") ?? "");
    if (!editedMessage.trim()) return;
    window.open(
      createWhatsAppUrl(siteConfig.whatsappNumber, editedMessage),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <dialog
      className="cart-dialog"
      ref={dialogRef}
      aria-labelledby="cart-title"
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeDialog();
      }}
    >
      <div className="cart-panel">
        <div className="cart-panel-head">
          {previewing ? (
            <button className="icon-button" type="button" onClick={goBack} aria-label="Retour au panier">
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
          ) : (
            <span className="cart-head-icon" aria-hidden="true">
              <ShoppingBag size={19} />
            </span>
          )}
          <div className="cart-head-copy">
            <p className="eyebrow">{previewing ? "Avant d'envoyer" : `${count} article${count > 1 ? "s" : ""}`}</p>
            <h2 id="cart-title">{previewing ? "Vérifiez votre message" : "Votre sélection"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={closeDialog} aria-label="Fermer le panier">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {!previewing ? (
          <>
            {lines.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon" aria-hidden="true">
                  <ShoppingBag size={26} />
                </span>
                <h3>Votre panier est encore vide.</h3>
                <p>Parcourez les exemples de menu et composez une demande à votre façon.</p>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => {
                    closeDialog();
                    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    document
                      .getElementById("menu")
                      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
                  }}
                >
                  Découvrir le menu <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <>
                {siteConfig.demoMode && (
                  <div className="cart-demo-notice" role="note">
                    <Sparkles size={15} aria-hidden="true" />
                    <span>Panier de démonstration. Noms, options et montants fictifs.</span>
                  </div>
                )}
                <div className="cart-lines">
                  {lines.map((line) => (
                    <article className="cart-line" key={line.key}>
                      <div className="cart-line-info">
                        <h3>{line.name}</h3>
                        <p>{line.size.label}</p>
                        {line.extras.length > 0 && (
                          <p>+ {line.extras.map((extra) => extra.label).join(", ")}</p>
                        )}
                        <strong>
                          {siteConfig.demoMode || siteConfig.pricesVerified
                            ? formatAriary(
                                (line.size.priceAr +
                                  line.extras.reduce((total, extra) => total + extra.priceAr, 0)) *
                                  line.quantity,
                              )
                            : "Prix à confirmer"}
                        </strong>
                      </div>
                      <div className="cart-line-tools">
                        <div className="quantity-stepper" aria-label={`Quantité pour ${line.name}`}>
                          <button
                            type="button"
                            onClick={() => onChangeQuantity(line.key, -1)}
                            aria-label={`Diminuer la quantité de ${line.name}`}
                          >
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <span aria-live="polite">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onChangeQuantity(line.key, 1)}
                            aria-label={`Augmenter la quantité de ${line.name}`}
                          >
                            <Plus size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <button
                          className="remove-line"
                          type="button"
                          onClick={() => onRemove(line.key)}
                          aria-label={`Retirer ${line.name} du panier`}
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="cart-total">
                  <span>
                    {siteConfig.demoMode
                      ? "Total indicatif"
                      : siteConfig.pricesVerified
                        ? "Sous-total"
                        : "Total indisponible"}
                  </span>
                  <strong>
                    {siteConfig.demoMode || siteConfig.pricesVerified
                      ? formatAriary(subtotal)
                      : "À confirmer"}
                  </strong>
                  <small>
                    {siteConfig.demoMode
                      ? "Calculé à partir de tarifs entièrement fictifs."
                      : siteConfig.pricesVerified
                        ? "Total calculé selon les tarifs configurés."
                        : "Les tarifs n'ont pas encore été confirmés."}
                  </small>
                </div>
                <button className="button button-primary cart-continue" type="button" onClick={goToPreview}>
                  Préparer une demande WhatsApp <ArrowRight size={17} aria-hidden="true" />
                </button>
                <p className="cart-footnote">
                  Prévisualisez et modifiez le message avant d'ouvrir WhatsApp. Aucun envoi ni aucune commande
                  n'est automatique.
                </p>
              </>
            )}
          </>
        ) : (
          <form className="message-preview" onSubmit={handleSubmit}>
            <div className="preview-owner-note">
              <strong>
                {siteConfig.onlineOrderingEnabled
                  ? "Vous allez contacter directement la pizzeria."
                  : "Fonction à valider par le propriétaire."}
              </strong>
              <span>
                {siteConfig.onlineOrderingEnabled
                  ? "Votre message ouvrira une conversation WhatsApp ; la pizzeria devra répondre pour confirmer la disponibilité."
                  : "Ceci est une proposition de parcours. Votre message ouvrira une conversation WhatsApp ; la pizzeria devra répondre pour confirmer la disponibilité."}
              </span>
            </div>
            <label htmlFor="whatsapp-message">Message modifiable</label>
            <textarea
              id="whatsapp-message"
              name="message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={Math.min(14, Math.max(8, draft.split("\n").length + 2))}
              required
            />
            {(!siteConfig.pricesVerified || siteConfig.demoMode) && (
              <p className="price-omission">
                Les prix et le total sont volontairement absents du message : les tarifs ne sont pas vérifiés.
              </p>
            )}
            <button className="button button-primary cart-continue" type="submit">
              Ouvrir WhatsApp <ArrowRight size={17} aria-hidden="true" />
            </button>
            <button className="preview-back" type="button" onClick={goBack}>
              Revenir au panier pour modifier les articles
            </button>
            <p className="cart-footnote">
              L'application ne transmet rien sans votre clic et n'affiche aucune confirmation de commande.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState<"Tout" | MenuCategory>("Tout");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const cartDialogRef = useRef<HTMLDialogElement>(null);

  const publishedProducts = siteConfig.demoMode
    ? menuProducts
    : menuProducts.filter((product) => !product.isExample);
  const visibleProducts =
    activeCategory === "Tout"
      ? publishedProducts
      : publishedProducts.filter((product) => product.category === activeCategory);

  useEffect(() => {
    const dialog = cartDialogRef.current;
    if (!dialog) return;
    if (cartOpen && !dialog.open) dialog.showModal();
    if (!cartOpen && dialog.open) dialog.close();
  }, [cartOpen]);

  useEffect(() => {
    if (!announcement) return;
    const timeout = window.setTimeout(() => setAnnouncement(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [announcement]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("reveal-ready");
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileNavOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function addLine(line: Omit<CartLine, "key" | "quantity">) {
    setCart((current) => addCartLine(current, line));
    setAnnouncement(`${line.name} ajouté au panier de démonstration.`);
  }

  const navItems = [
    { href: "#accueil", label: "Accueil" },
    { href: "#menu", label: "Notre menu" },
    { href: "#histoire", label: "Notre histoire" },
    { href: "#contact", label: "Nous trouver" },
  ];

  return (
    <>
      {siteConfig.demoMode && (
        <div className="demo-banner">
          <span className="demo-banner-mark" aria-hidden="true">i</span>
          <p>
            <strong>Aperçu de proposition</strong>
            <span>Menu, prix et commande WhatsApp à valider avant publication.</span>
          </p>
        </div>
      )}

      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
            <nav
              className={`main-nav${mobileNavOpen ? " is-open" : ""}`}
              id="mobile-navigation"
              aria-label="Navigation principale"
            >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
                {item.label}
              </a>
            ))}
            <button
              className="nav-cart-mobile"
              type="button"
              onClick={() => {
                setCartOpen(true);
                setMobileNavOpen(false);
              }}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              Panier ({cartCount(cart)})
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="cart-trigger"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Ouvrir le panier, ${cartCount(cart)} article${cartCount(cart) > 1 ? "s" : ""}`}
            >
              <ShoppingBag size={19} aria-hidden="true" />
              <span>Panier</span>
              <span className="cart-count">{cartCount(cart)}</span>
            </button>
            <WhatsAppLink className="button button-primary header-whatsapp">
              Commander sur WhatsApp <ArrowRight size={16} aria-hidden="true" />
            </WhatsAppLink>
            <button
              className="mobile-menu-toggle"
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileNavOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              {mobileNavOpen ? <X size={22} aria-hidden="true" /> : <MenuIcon size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="eyebrow-line" />
              Antsiranana · Madagascar
            </div>
            <h1>
              Une part de
              <br />
              bonheur <em>à chaque</em>
              <br />
              bouchée.
            </h1>
            <p className="hero-intro">
              Une envie de pizza ? Découvrez Oh! La! La Pizza's à Antsiranana et préparez-vous à savourer de
              bons moments.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#menu">
                Découvrir notre menu <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a className="button button-quiet" href={siteConfig.mapsSearchUrl} target="_blank" rel="noreferrer">
                <MapPin size={17} aria-hidden="true" /> Nous trouver
              </a>
            </div>
            <div className="hero-lower">
              <div className="hero-location">
                <MapPin size={15} aria-hidden="true" />
                <span>Rue Sainte-Marie<br />Antsiranana 201</span>
              </div>
              <a className="scroll-cue" href="#menu">
                <span>Défiler pour découvrir</span>
                <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src={siteConfig.heroImage}
              alt="Pizza chaude photographiée pour illustrer la proposition de site"
              fetchPriority="high"
            />
            <div className="hero-photo-shade" />
            <div className="hero-vertical-note">CHAUD · À PARTAGER · ANTSIRANANA</div>
            <div className="hero-photo-caption">
              <span>01 / UN MOMENT À SAVOURER</span>
              {siteConfig.demoMode && <span>Photo d'illustration · remplaçable</span>}
            </div>
            <div className="hero-sticker" aria-label="Une idée à partager">
              <span className="sticker-small">À PARTAGER</span>
              <span className="sticker-main">avec<br />le sourire</span>
              <span className="sticker-star" aria-hidden="true">✳</span>
            </div>
          </div>
        </section>

        <section className="menu-section section-pad" id="menu">
          <div className="section-heading menu-heading" data-reveal>
            <div>
              <p className="eyebrow"><span className="eyebrow-line" />La carte</p>
              <h2>De bonnes pizzas.<br /><em>De grands moments.</em></h2>
            </div>
            <p className="section-intro">
              {siteConfig.demoMode
                ? "Découvrez une première mise en scène du menu. Les produits, compositions et prix ci-dessous sont des exemples à remplacer par les informations validées par le propriétaire."
                : "Découvrez la carte de Oh! La! La Pizza's à Antsiranana. Contactez la pizzeria pour vérifier la disponibilité des produits."}
            </p>
          </div>
          {siteConfig.demoMode && (
            <div className="menu-demo-note" role="note">
              <span className="demo-note-icon" aria-hidden="true">!</span>
              <p>
                <strong>Menu de démonstration</strong>
                <span>
                  Les noms, recettes, formats et tarifs sont fictifs. Les montants en ariary ne sont pas les
                  prix de la pizzeria.
                </span>
              </p>
            </div>
          )}
          <div className="menu-toolbar">
            <div className="category-list" role="group" aria-label="Filtrer les exemples par catégorie">
              {categoryFilters.map((category) => (
                <button
                  className={`category-filter${activeCategory === category ? " is-active" : ""}`}
                  type="button"
                  key={category}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                  {activeCategory === category && <span className="filter-dot" aria-hidden="true" />}
                </button>
              ))}
            </div>
            <span className="menu-count">
              {visibleProducts.length} {siteConfig.demoMode ? "exemples" : "produits"}
            </span>
          </div>
          <div className="menu-grid" aria-live="polite">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addLine} />
              ))
            ) : (
              <p className="catalogue-empty">
                La carte est en cours de mise à jour. Contactez la pizzeria pour connaître les produits disponibles.
              </p>
            )}
          </div>
          {siteConfig.demoMode && (
            <p className="menu-endnote">
              Les visuels sont eux aussi des illustrations. Remplacez-les par des photographies dont le restaurant
              détient les droits d'utilisation.
            </p>
          )}
        </section>

        <section className="story-section" id="histoire">
          <div className="story-image-wrap" data-reveal>
            <img
              src={siteConfig.storyImage}
              alt="Scène culinaire d'illustration pour la section histoire"
              loading="lazy"
            />
            {siteConfig.demoMode && <span className="story-image-label">IMAGE D'ILLUSTRATION</span>}
          </div>
          <div className="story-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-line" />Notre histoire</p>
            <h2>Bien plus qu'une pizza :<br /><em>un moment à partager.</em></h2>
            <p className="story-quote">
              « {siteConfig.storyText} »
            </p>
            <p className="story-validation">
              <Sparkles size={16} aria-hidden="true" />
              {siteConfig.storyIsProposal
                ? "Texte de proposition — à valider par le propriétaire."
                : "Présentation de la maison."}
            </p>
            <a className="text-link story-link" href="#contact">
              Rencontrons-nous <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="story-side-note" aria-hidden="true">OH! LA! LA PIZZA'S · ANTSIRANANA</div>
        </section>

        <section className="reasons-section section-pad">
          <div className="reasons-heading" data-reveal>
            <p className="eyebrow"><span className="eyebrow-line" />L'esprit de la maison</p>
            <h2>Un bon prétexte<br /><em>pour se retrouver.</em></h2>
          </div>
          <div className="reasons-grid">
            <article className="reason-card" data-reveal>
              <span className="reason-number">01</span>
              <span className="reason-icon"><UsersRound size={23} strokeWidth={1.5} aria-hidden="true" /></span>
              <h3>Le plaisir de partager</h3>
              <p>Un moment convivial autour du plaisir de manger ensemble.</p>
            </article>
            <article className="reason-card" data-reveal>
              <span className="reason-number">02</span>
              <span className="reason-icon"><Clock3 size={23} strokeWidth={1.5} aria-hidden="true" /></span>
              <h3>Votre moment pizza</h3>
              <p>Une invitation à faire une pause gourmande et à profiter du moment.</p>
            </article>
            <article className="reason-card" data-reveal>
              <span className="reason-number">03</span>
              <span className="reason-icon"><MapPin size={23} strokeWidth={1.5} aria-hidden="true" /></span>
              <h3>Au cœur d'Antsiranana</h3>
              <p>Retrouvez l'adresse de la pizzeria, rue Sainte-Marie, à Antsiranana.</p>
            </article>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-line" />Nous trouver</p>
            <h2>Une envie de pizza ?<br /><em>On vous répond.</em></h2>
            <p className="contact-intro">
              Passez nous voir ou contactez directement Oh! La! La Pizza's pour vérifier la carte et les
              disponibilités.
            </p>
            <div className="contact-details">
              <div className="contact-detail">
                <span className="contact-detail-icon"><MapPin size={18} aria-hidden="true" /></span>
                <div>
                  <span className="detail-label">Adresse communiquée</span>
                  <address>{siteConfig.address}</address>
                </div>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-icon"><Clock3 size={18} aria-hidden="true" /></span>
                <div>
                  <span className="detail-label">Horaires</span>
                  <p>{siteConfig.closingTimeNote}</p>
                </div>
              </div>
              <div className="contact-detail">
                <span className="contact-detail-icon"><ShoppingBag size={18} aria-hidden="true" /></span>
                <div>
                  <span className="detail-label">Téléphone</span>
                  <a href={`tel:${siteConfig.phoneTel}`}>{siteConfig.phoneDisplay}</a>
                </div>
              </div>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" href={siteConfig.mapsDirectionsUrl} target="_blank" rel="noreferrer">
                Obtenir l'itinéraire <ArrowRight size={17} aria-hidden="true" />
              </a>
              <WhatsAppLink className="button button-outline">
                Écrire sur WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <div className="map-card" data-reveal>
            {siteConfig.locationVerified && siteConfig.mapsEmbedUrl ? (
              <iframe
                className="map-embed"
                title="Carte Google Maps de Oh! La! La Pizza's"
                src={siteConfig.mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <>
                <div className="map-grid" aria-hidden="true" />
                <div className="map-compass" aria-hidden="true">N<span>↑</span></div>
                <div className="map-card-content">
                  <span className="map-pin"><MapPin size={25} aria-hidden="true" /></span>
                  <span className="map-label">Antsiranana · 201</span>
                  <h3>Rue Sainte-Marie</h3>
                  <p>
                    {siteConfig.locationVerified
                      ? "Consultez la recherche Google Maps pour situer la pizzeria."
                      : "La localisation et l'épingle exacte restent à vérifier."}
                  </p>
                  <a
                    href={siteConfig.mapsPlaceUrl || siteConfig.mapsSearchUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {siteConfig.locationVerified ? "Ouvrir Google Maps" : "Rechercher dans Google Maps"}
                    <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
                {!siteConfig.locationVerified && (
                  <span className="map-card-foot">RECHERCHE MAPS · PAS D'ÉPINGLE VÉRIFIÉE</span>
                )}
              </>
            )}
          </div>
        </section>

        <section className="closing-band">
          <div>
            <span className="closing-asterisk" aria-hidden="true">✳</span>
            <p className="eyebrow">Un petit mot suffit</p>
            <h2>On se retrouve<br /><em>autour d'une pizza ?</em></h2>
          </div>
          <WhatsAppLink className="button button-cream">
            Nous contacter <ArrowRight size={17} aria-hidden="true" />
          </WhatsAppLink>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand-col">
            <BrandMark light />
            <p>Une envie de pizza ? À Antsiranana, Oh! La! La Pizza's vous accueille pour savourer de bons moments.</p>
          </div>
          <div className="footer-links-col">
            <span className="footer-label">Explorer</span>
            <a href="#menu">Notre menu</a>
            <a href="#histoire">Notre histoire</a>
            <a href="#contact">Nous trouver</a>
          </div>
          <div className="footer-links-col">
            <span className="footer-label">Contact</span>
            <a href={`tel:${siteConfig.phoneTel}`}>{siteConfig.phoneDisplay}</a>
            <a href={siteConfig.mapsSearchUrl} target="_blank" rel="noreferrer">Rue Sainte-Marie, Antsiranana</a>
            <WhatsAppLink className="footer-whatsapp">WhatsApp <ArrowRight size={14} aria-hidden="true" /></WhatsAppLink>
            {siteConfig.socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Oh! La! La Pizza's. Tous droits réservés.</span>
          <span>Antsiranana · Madagascar</span>
          <a href="#accueil">Retour en haut ↑</a>
        </div>
      </footer>

      <CartDialog
        dialogRef={cartDialogRef}
        lines={cart}
        onClose={() => setCartOpen(false)}
        onChangeQuantity={(key, delta) => setCart((current) => changeQuantity(current, key, delta))}
        onRemove={(key) => setCart((current) => removeCartLine(current, key))}
      />
      {announcement && (
        <div className="toast-message" role="status">
          <Check size={16} aria-hidden="true" />
          {announcement}
        </div>
      )}
      {cartCount(cart) > 0 && (
        <button
          className="mobile-cart-fab"
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Ouvrir le panier, ${cartCount(cart)} article${cartCount(cart) > 1 ? "s" : ""}`}
        >
          <ShoppingBag size={20} aria-hidden="true" />
          <span>Panier</span>
          <span className="cart-count">{cartCount(cart)}</span>
        </button>
      )}
    </>
  );
}

export default App;
