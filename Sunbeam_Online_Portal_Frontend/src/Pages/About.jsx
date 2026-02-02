// src/Pages/About.jsx
function About() {
  return (
    <div className="container my-4">
      {/* HERO BANNER */}
      <div
        className="p-5 text-center text-white rounded"
        style={{
          background: "#14b8d4",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1 className="display-4 fw-bold mb-2">About Sunbeam</h1>
        <p className="lead mb-0" style={{ maxWidth: 900 }}>
          Empowering professionals with cutting-edge training and solutions since
          the late 90&apos;s
        </p>
      </div>

      {/* OUR PHILOSOPHY */}
      <div className="card shadow-sm my-4">
        <div
          className="card-header fw-bold text-white"
          style={{ background: "#14b8d4" }}
        >
          💡 Our Philosophy
        </div>

        <div className="card-body">
          <p className="mb-0" style={{ lineHeight: 1.7 }}>
            At Sunbeam we believe retaining a competitive edge is imperative for
            any individual in today&apos;s professional world. Companies are
            restructuring their organizations &amp; reengineering their business
            processes. Not only have the challenges become more demanding, but
            also the rewards of staying at the forefront seem to be promising.
          </p>
        </div>
      </div>

      {/* TWO CARDS */}
      <div className="row g-4 pb-5">
        {/* OUR EXPERTISE */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-bold text-info">⭐ Our Expertise</div>
            <div className="card-body">
              <p className="mb-0" style={{ lineHeight: 1.7 }}>
                In this scenario, technical &amp; personal skills which provide
                effective solutions &amp; time critical support are of principal
                significance for the long term growth of professionals.
                Sunbeam&apos;s expertise in effectively delivering training,
                solutions &amp; services has made it a favored institution to
                many students &amp; professionals focused on an aggressive career
                growth strategy.
              </p>
            </div>
          </div>
        </div>

        {/* OUR SUCCESS */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-bold text-info">🏆 Our Success</div>
            <div className="card-body">
              <p className="mb-0" style={{ lineHeight: 1.7 }}>
                Sunbeam&apos;s proven track record in bringing about effective
                transformations in individuals is backed by a solid understanding
                of the rapidly changing needs of the industry &amp; the global
                business scenario. Sunbeam&apos;s success has been built on its
                comprehensively researched, innovative training methodologies,
                deployment of technology and an emphasis on transformational
                &amp; industry-relevant programs offering value-added services to
                its clients
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
