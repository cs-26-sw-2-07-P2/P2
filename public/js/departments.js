// Department data for all the different departments in the park, including descriptions and employee profiles.
// All departments have different parameters for the employee profiles, such as whether they work outside, have customer contact, physical demand, and difficulty level. 
// This data will be used to match employees to suitable departments based on their preferences and qualifications.

const departmentData = {
    "Rides": {
        description: "Responsible for the operation and maintenance of all rides in the park, ensuring safety and providing an enjoyable experience for guests.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "high",
            emp_Difficulty: "low"
        }
    },
    "Kiosks": {
        description: "Responsible for operating kiosks throughout the park, providing information and services to guests.",
        profile: {
            emp_Outside: "no",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "medium",
            emp_Difficulty: "medium"
        }
    },
    "Restaurants": {
        description: "Responsible for operating restaurants throughout the park, providing food and beverage services to guests.",
        profile: {
            emp_Outside: "no",
            emp_CustomerContact: "no",
            emp_PhysicalDemand: "medium",
            emp_Difficulty: "medium"
        }
    },
    "Guide": {
        description: "Responsible for guiding guests throughout the park, providing information and assistance.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "low",
            emp_Difficulty: "medium"
        }
    },
    "Parking": {
        description: "Responsible for managing parking spaces outside throughout the park.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "no",
            emp_PhysicalDemand: "low",
            emp_Difficulty: "low"
        }
    },
    "Maintenance": {
        description: "Responsible for maintaining and repairing park facilities and equipment.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "no",
            emp_PhysicalDemand: "high",
            emp_Difficulty: "high"
        }
    },
    "Merchandise": {
        description: "Responsible for operating merchandise stands throughout the park.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "medium",
            emp_Difficulty: "medium"
        }
    },
    "Mascots": {
        description: "Responsible for entertaining guests and representing the park.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "low",
            emp_Difficulty: "medium"
        }
    },
    "Tickets": {
        description: "Responsible for selling and handling ticket sales throughout the park.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "low",
            emp_Difficulty: "low"
        }
    },
    "Lifeguards": {
        description: "Responsible for ensuring guest safety in and around water attractions.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "high",
            emp_Difficulty: "high"
        }
    },
    "Hotel": {
        description: "Responsible for operating the hotel within the park.",
        profile: {
            emp_Outside: "no",
            emp_CustomerContact: "yes",
            emp_PhysicalDemand: "medium",
            emp_Difficulty: "medium"
        }
    },
    "Cleaning": {
        description: "Responsible for maintaining cleanliness throughout the park.",
        profile: {
            emp_Outside: "yes",
            emp_CustomerContact: "no",
            emp_PhysicalDemand: "medium",
            emp_Difficulty: "medium"
        }
    }
};