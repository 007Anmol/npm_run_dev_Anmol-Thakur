import { useEffect, useState } from "react";

interface Law {
  id: number;
  title: string;
  description: string;
}

const hardcodedLaws: Law[] = [
  {
    id: 1,
    title: "Indian Penal Code, 1860",
    description: "Defines crimes and punishments in India.",
  },
  {
    id: 2,
    title: "Code of Criminal Procedure, 1973",
    description: "Procedural law for conducting criminal trials.",
  },
  {
    id: 3,
    title: "Constitution of India, 1950",
    description:
      "Supreme law that lays down fundamental rights, directive principles, and duties.",
  },
  {
    id: 4,
    title: "Hindu Marriage Act, 1955",
    description: "Governs marriage and divorce among Hindus.",
  },
  {
    id: 5,
    title: "Muslim Personal Law (Shariat) Application Act, 1937",
    description: "Applies Sharia law to Indian Muslims in personal matters.",
  },
  {
    id: 6,
    title: "Special Marriage Act, 1954",
    description:
      "Provides a legal framework for interfaith and civil marriages.",
  },
  {
    id: 7,
    title: "Indian Contract Act, 1872",
    description: "Regulates contracts in India.",
  },
  {
    id: 8,
    title: "Negotiable Instruments Act, 1881",
    description: "Governs promissory notes, bills of exchange, and cheques.",
  },
  {
    id: 9,
    title: "Companies Act, 2013",
    description:
      "Regulates company incorporation, management, and dissolution.",
  },
  {
    id: 10,
    title: "Factories Act, 1948",
    description: "Ensures worker safety and welfare in factories.",
  },
  {
    id: 11,
    title: "Industrial Disputes Act, 1947",
    description: "Regulates industrial disputes and labor rights.",
  },
  {
    id: 12,
    title: "Consumer Protection Act, 2019",
    description: "Protects consumer rights and establishes consumer councils.",
  },
  {
    id: 13,
    title: "Right to Information Act, 2005",
    description:
      "Ensures transparency in government by allowing public access to information.",
  },
  {
    id: 14,
    title: "Information Technology Act, 2000",
    description: "Regulates cyber activities and electronic transactions.",
  },
  {
    id: 15,
    title: "Arbitration and Conciliation Act, 1996",
    description: "Governs arbitration proceedings in India.",
  },
  {
    id: 16,
    title: "Environmental Protection Act, 1986",
    description: "Framework law for environmental protection in India.",
  },
  {
    id: 17,
    title: "Wildlife Protection Act, 1972",
    description: "Protects wildlife and endangered species in India.",
  },
  {
    id: 18,
    title: "The Air (Prevention and Control of Pollution) Act, 1981",
    description: "Regulates air pollution control measures.",
  },
  {
    id: 19,
    title: "The Water (Prevention and Control of Pollution) Act, 1974",
    description: "Regulates water pollution control measures.",
  },
  {
    id: 20,
    title: "The Motor Vehicles Act, 1988",
    description: "Regulates motor vehicle laws and road safety.",
  },
  {
    id: 21,
    title: "The Goods and Services Tax (GST) Act, 2017",
    description: "Introduces and governs the Goods and Services Tax system.",
  },
  {
    id: 22,
    title: "The Income Tax Act, 1961",
    description: "Governs income tax rules and regulations in India.",
  },
  {
    id: 23,
    title: "The Dowry Prohibition Act, 1961",
    description: "Prohibits the giving or receiving of dowry in marriages.",
  },
  {
    id: 24,
    title: "The Child Labour (Prohibition and Regulation) Act, 1986",
    description:
      "Prohibits employment of children below 14 years in hazardous occupations.",
  },
  {
    id: 25,
    title: "The Juvenile Justice (Care and Protection of Children) Act, 2015",
    description: "Protects the rights of children in conflict with the law.",
  },
  {
    id: 26,
    title: "The Protection of Women from Domestic Violence Act, 2005",
    description: "Protects women against domestic violence.",
  },
  {
    id: 27,
    title: "The Maternity Benefit Act, 1961",
    description: "Provides maternity leave and benefits to female employees.",
  },
  {
    id: 28,
    title: "The Medical Termination of Pregnancy Act, 1971",
    description: "Regulates abortion laws in India.",
  },
  {
    id: 29,
    title: "The Transgender Persons (Protection of Rights) Act, 2019",
    description: "Ensures rights and welfare of transgender individuals.",
  },
  {
    id: 30,
    title: "The Right of Children to Free and Compulsory Education Act, 2009",
    description: "Guarantees free education to children aged 6-14 years.",
  },
  {
    id: 31,
    title: "The Prevention of Money Laundering Act, 2002",
    description: "Prevents money laundering and regulates financial crimes.",
  },
  {
    id: 32,
    title:
      "The Aadhaar (Targeted Delivery of Financial and Other Subsidies) Act, 2016",
    description: "Regulates the use of Aadhaar for welfare benefits.",
  },
  {
    id: 33,
    title: "The Representation of the People Act, 1951",
    description: "Governs the conduct of elections in India.",
  },
  {
    id: 34,
    title:
      "The Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
    description: "Prevents discrimination against SC/ST communities.",
  },
  {
    id: 35,
    title: "The Arms Act, 1959",
    description: "Regulates firearms possession and licensing.",
  },
  {
    id: 36,
    title: "The Copyright Act, 1957",
    description: "Protects intellectual property rights in creative works.",
  },
  {
    id: 37,
    title: "The Patents Act, 1970",
    description: "Regulates patent rights and innovations in India.",
  },
  {
    id: 38,
    title: "The National Security Act, 1980",
    description: "Empowers preventive detention for national security reasons.",
  },
  {
    id: 39,
    title: "The Official Secrets Act, 1923",
    description: "Deals with national security and classified information.",
  },
  {
    id: 40,
    title: "The Prevention of Corruption Act, 1988",
    description: "Criminalizes corruption among public officials.",
  },
  {
    id: 41,
    title: "The Narcotic Drugs and Psychotropic Substances Act, 1985",
    description: "Regulates and prohibits drugs and narcotics.",
  },
  {
    id: 42,
    title: "The Foreign Exchange Management Act, 1999",
    description: "Regulates foreign exchange and currency transactions.",
  },
  {
    id: 43,
    title: "The Indian Evidence Act, 1872",
    description: "Defines what constitutes admissible evidence in courts.",
  },
  {
    id: 44,
    title: "The Prevention of Sexual Harassment at Workplace Act, 2013",
    description: "Provides protection against sexual harassment at work.",
  },
  {
    id: 45,
    title: "The Epidemic Diseases Act, 1897",
    description: "Provides measures to prevent epidemic outbreaks.",
  },
  {
    id: 46,
    title: "The Mental Healthcare Act, 2017",
    description: "Ensures the rights of individuals with mental illnesses.",
  },
  {
    id: 47,
    title: "The Passport Act, 1967",
    description: "Regulates passport issuance and travel restrictions.",
  },
  {
    id: 48,
    title: "The Census Act, 1948",
    description: "Regulates census operations in India.",
  },
  {
    id: 49,
    title: "The Disaster Management Act, 2005",
    description: "Establishes disaster preparedness and response measures.",
  },
  {
    id: 50,
    title: "The RTI (Right to Information) Act, 2005",
    description: "Ensures transparency in governance.",
  },
];

const LawList = () => {
  const [laws, setLaws] = useState<Law[]>(hardcodedLaws);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">List of Laws</h1>
      <ul>
        {laws.map((law) => (
          <li key={law.id} className="p-4 mb-2 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">{law.title}</h2>
            <p className="text-gray-700">{law.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LawList;
