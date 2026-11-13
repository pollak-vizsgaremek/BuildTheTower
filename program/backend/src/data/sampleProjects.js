const project = (values, milestones = []) => ({
  status: 'active', startDate: '2025-01-15', endDate: '2025-09-30', budget: 480000000, spent: 345600000,
  progress: 71, completedProgress: 40, workers: 18, health: 'normal', featured: false,
  currentPhase: 'Homlokzati munkák és nyílászárók', ...values, milestones,
});
const milestone = (title, dueDate, responsible, status = 'prepared') => ({ title, dueDate, responsible, status, notes: '' });

export const sampleProjects = [
  project({ code: 'PRJ-2025-04', name: 'Duna Pearl Lakópark B Épület', location: 'Budapest, XIII., Duna sor 14.', featured: true }, [
    milestone('Északi homlokzat állványzat minőségi átadása', '2025-05-20', 'Scaffold System Kft.', 'review'),
    milestone('Schüco 3 rétegű nyílászárók érkezése', '2025-05-22', 'Alu-Technik Kft.', 'confirmed'),
    milestone('Homlokzat szigetelésének ellenőrzése', '2025-06-04', 'Építőmester Kft.'),
  ]),
  project({ code: 'PRJ-2024-11', name: 'Váci Greens Irodaház III. Ütem', location: 'Budapest, XIII., Váci út 120.', startDate: '2024-09-01',
    progress: 45, completedProgress: 27, budget: 1250000000, spent: 562500000, workers: 24, health: 'critical', featured: true,
    currentPhase: 'Födémek és pillérek kivitelezése' }, [
    milestone('4. emelet monolit zárófödém betonozása', '2025-05-19', 'Beton-Struktúra Kft.'),
    milestone('Gépészeti alapszerelés megkezdése', '2025-06-02', 'Gépész Partner Kft.', 'confirmed'),
    milestone('Tartószerkezeti műszaki bejárás', '2025-06-12', 'Statika Mérnökiroda', 'review'),
  ]),
  project({ code: 'PRJ-2024-02', name: 'Buda Gourmet Csarnok', location: 'Biatorbágy, Ipari Park 3.', startDate: '2024-03-01', endDate: '2025-06-30',
    progress: 91, completedProgress: 80, budget: 350000000, spent: 318000000, workers: 8, health: 'handover', featured: true,
    currentPhase: 'Műszaki átadás előkészítése' }, [
    milestone('Műszaki átadás és hibajegyzék felvétele', '2025-05-28', 'Buda Generál Kft.', 'review'),
    milestone('Használatbavételi dokumentáció átadása', '2025-06-10', 'Buda Generál Kft.', 'confirmed'),
  ]),
  project({ code: 'PRJ-2025-07', name: 'Rózsadomb Társasház', location: 'Budapest, II., Rózsa utca 8.', progress: 32, completedProgress: 15,
    workers: 12, budget: 240000000, spent: 76800000, currentPhase: 'Szerkezetépítés' }, [
    milestone('Földszinti födém ellenőrzése', '2025-06-06', 'Pillér Építő Kft.'),
  ]),
  project({ code: 'PRJ-2025-09', name: 'Kelenföld Üzletközpont', location: 'Budapest, XI., Etele út 42.', status: 'preparation', progress: 8, completedProgress: 0,
    workers: 0, budget: 620000000, spent: 12000000, endDate: '2026-06-30', currentPhase: 'Engedélyezés és tervezés' }, [
    milestone('Kiviteli tervek jóváhagyása', '2025-06-16', 'Forma Építésziroda', 'review'),
  ]),
  project({ code: 'PRJ-2025-12', name: 'Zöldliget Lakóudvar', location: 'Érd, Liget köz 6.', status: 'preparation', progress: 5, completedProgress: 0,
    workers: 0, budget: 310000000, spent: 6500000, endDate: '2026-05-31', currentPhase: 'Terület-előkészítés' }, [
    milestone('Közműegyeztetés lezárása', '2025-06-18', 'Közmű Mérnök Kft.'),
  ]),
  project({ code: 'PRJ-2023-08', name: 'Óbuda Irodapark', location: 'Budapest, III., Szentendrei út 90.', status: 'warranty', startDate: '2023-04-01',
    endDate: '2025-12-31', progress: 100, completedProgress: 100, workers: 0, budget: 780000000, spent: 752000000, currentPhase: 'Garanciális felülvizsgálat' }, [
    milestone('Éves garanciális bejárás', '2025-06-24', 'Óbuda Projekt Kft.', 'confirmed'),
  ]),
];
