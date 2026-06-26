export default function ServiceManagement() {
  const services = [
    {
      title: "Driving Admissions",
      icon: "🚗",
      desc: "Manage admissions",
    },
    {
      title: "Driving Licences",
      icon: "🪪",
      desc: "Licence requests",
    },
    {
      title: "Insurance",
      icon: "🛡",
      desc: "Vehicle policies",
    },
    {
      title: "PUC Certificates",
      icon: "📄",
      desc: "PUC management",
    },
  ];

  return (
    <div>
      <div className="bg-slate-900 text-white rounded-xl px-4 py-3 mb-4">
        <h2 className="font-semibold">
          Service Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="
              bg-white
              border
              rounded-2xl
              p-4
              hover:shadow-md
              transition
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {service.icon}
                </span>

                <div>
                  <h3 className="font-semibold text-sm">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {service.desc}
                  </p>
                </div>
              </div>

              <a
                href="#"
                className="text-[#f59e0b] text-sm font-medium"
              >
                Open →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}