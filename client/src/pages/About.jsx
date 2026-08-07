import { useContent, useSection } from "../context/ContentContext";

function ImageSlot({ label, className = "" }) {
  return (
    <div
      className={`ux-img-slot ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}

const marquee = [
  "FOURTH INDUSTRIAL REVOLUTION",
  "INDIVIDUATION",
  "AGE OF THE ENTREPRENEUR",
  "COLLECTIVE CONSCIOUSNESS",
];

const speakingTopics = [
  "Celebrating Success One Failure at a Time",
  "Ten Business Lessons From a Tiny Greek Island",
  "Creativity and Innovation and Business 101",
  "The I's Behind the Why - Finding Meaning",
  "Don't Ask, Don't Get - The Science of Askology",
];

const workshops = [
  "The Road to UtopiaX Starts With Why",
  "Design Thinking Bootcamp",
  "Your Relevant Future",
  "Innovation X Change",
  "Leadership X Change",
];

const teamPhotos = {
  "Raz O'Connor": "/images/raz-oconnor.png",
  "Christopher Veltheim": "/images/christopher-veltheim.png",
  "Hayley Neil": "/images/hayley-neil.png",
};

export default function About() {
  const page = useSection("about");
  const { content } = useContent();
  const team = (content.team || []).filter(
    (member) => member.name !== "Christina Gerakiteys",
  );

  return (
    <div className="about-landing">
      <section className="about-hero">
        <img
          src="/images/about-hero.png"
          alt=""
          className="about-hero__image"
        />
        <div className="about-hero__overlay" />
        <div className="about-hero__content">
          <span className="about-badge">
            <span className="about-badge__dot" />
            About UtopiaX
          </span>
          <h1>Inspiring hearts and minds to possibility</h1>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-mission__watermark" aria-hidden="true">
          X
        </div>
        <div className="about-mission__brand">
          <img src="/logos/utopiax.png" alt="" />
          <span>
            Utopia<strong>X</strong>
          </span>
        </div>
        <h2>
          UtopiaX is on a mission to make the Impossible Possible: we are
          entering the fourth industrial revolution, characterised by the
          blurring of lines between the physical, the digital, and the
          biological through technology.
        </h2>
        <div className="about-mission__copy">
          <p>
            At UtopiaX, we unleash the boundaries around possibility, to make
            the impossible possible. If you think that&apos;s fluffy, look at
            your phone. Or your car. Or think about the last time you caught a
            plane or looked up something on the internet.
          </p>
          <p>
            We are entering the age of the entrepreneur. UtopiaX recognises
            individuation, where everyone is free from automation and able to
            bring their unique skills to the forefront.
          </p>
          <p>
            There is a movement happening, a collective consciousness working
            towards a better world through personal and business development.
          </p>
        </div>
      </section>

      <div className="ux-marquee about-marquee" aria-hidden="true">
        <div className="ux-marquee__track">
          {[...marquee, ...marquee].map((item, index) => (
            <span className="ux-marquee__item" key={`${item}-${index}`}>
              <span>{item}</span>
              <span className="ux-marquee__star">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="about-founder">
        <div className="about-founder__copy">
          <span className="ux-kicker">Founder / UtopiaX</span>
          <h2>
            <a
              href={page.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.founderName}
            </a>
          </h2>
          <div className="about-founder__bio">
            <p>
              Christina Gerakiteys is a creativity and innovation catalyst.
              Her purpose is to ignite hearts and minds to what is possible.
            </p>
            <p>
              With a strong communication background, she passionately writes
              and presents business development and innovation programs and
              workshops. She is also a sought-after facilitator for corporate
              events and conferences.
            </p>
            <p>
              Christina is founder of UtopiaX, a business with its focus on
              creativity and innovation. She writes for several publications
              and speaks regularly on radio about business development and the
              crucial roles that creativity and innovation play in success.
            </p>
            <p>
              Her depth of knowledge and engaging style has made her a popular
              presenter at major conferences including SingularityU Australia
              Summit, Vivid Ideas and Creative Innovation.
            </p>
            <p>
              A self-confessed lifelong learner, she is a graduate of the
              Executive Program at Singularity University (Cupertino, Silicon
              Valley) and is currently undertaking doctorate studies in
              Creativity and Innovation.
            </p>
          </div>
          <div className="about-founder__lists">
            {[
              ["Speaking Topics", speakingTopics],
              ["Workshops", workshops],
            ].map(([title, items]) => (
              <div className="about-topic-card" key={title}>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="about-founder__media">
          <figure>
            <img
              src="/images/christina-gerakiteys.png"
              alt="Christina Gerakiteys"
              className="about-founder__photo"
            />
          </figure>
          <div className="about-founder__quote">
            <span aria-hidden="true">“</span>
            <blockquote>
              Christina is an Entrepreneurial Futurist and Business
              Accelerator. She identified the need for entrepreneurship and
              innovation leadership twenty years before Australasia. A gifted
              mentor who can future proof your business.
            </blockquote>
            <p>- Louise Karch, Namefluence</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="about-team__watermark" aria-hidden="true">
          THE TEAM
        </div>
        <header>
          <span className="ux-kicker">Team / UtopiaX</span>
          <h2>Meet the collaborators</h2>
        </header>
        <div className="about-team__posters">
          {team.map((member, index) => (
            <article className="about-poster" key={member.name}>
              {teamPhotos[member.name] ? (
                <img
                  src={teamPhotos[member.name]}
                  alt={member.name}
                  className="about-poster__photo"
                />
              ) : (
                <ImageSlot label={`${member.name} - portrait`} />
              )}
              <div className="about-poster__caption">
                <span>
                  {String(index + 1).padStart(2, "0")} -{" "}
                  {member.role.split("-")[0].replace("Brand Design", "").trim()}
                </span>
                <h3>{member.name}</h3>
              </div>
            </article>
          ))}
        </div>
        <div className="about-team__bios">
          {team.map((member) => (
            <p key={`${member.name}-bio`}>{member.bio}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
