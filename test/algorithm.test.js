import { test, expect } from "vitest";
import { employee, parameter } from "../server/prismaClient";

const algorithm = await import("../server/algorithm.js");
const normalize = algorithm.normalize;
const calculateCompatibility = algorithm.calculateCompatibility;
const distributeEmployees = algorithm.distributeEmployees;


// Check normalize function
test("normalize(0) check", () => {
    expect(normalize(0)).toBe(0)
})
test("normalize(1) check", () => {
    expect(normalize(1)).toBe(0.25)
})
test("normalize(2) check", () => {
    expect(normalize(2)).toBe(0.5)
})
test("normalize(3) check", () => {
    expect(normalize(3)).toBe(0.75)
})
test("normalize(4) check", () => {
    expect(normalize(4)).toBe(1)
})

// Check compatibility function
// 2 users and 1 job, high and low matching scores
const userHighScore = {
    employee: {id: 1, user: { username: "Alan" } },
    answers: [
        {
            value: 4,
            question: {
                parameter: { name: "physical" }
            }
        }
    ],
}
const userLowScore = {
    employee: {id: 2, user: { username: "Bob" } },
    answers: [
        {
            value: 0,
            question: {
                parameter: { name: "physical" }
            }
        }
    ]
}
const job = {
    id: 1,
    name: "Cleaning",
    capacity: 2,
    parameters: [
        {
            weight: 4,
            parameter: { name: "physical" }
        }
    ]
}
test("Check compatibility, 2 employees 1 job", () => {
    const results = calculateCompatibility([userHighScore, userLowScore], [job]);
    expect(results[0].priorities[0].compatibility).toBe(1);
    expect(results[1].priorities[0].compatibility).toBe(0);
})

// Check for no matching parameters between user and job
const userNoMatch = {
    employee: {id: 1, user: { username: "Alan" } },
    answers: [
        {
            value: 4,
            question: {
                parameter: { name: "physical" }
            }
        }
    ]
} 
const jobNoMatch = {
    id: 1,
    name: "Store Clerk",
    capacity: 2,
    parameters: [
        {
            weight: 4,
            parameter: { name: "social" }
        }
    ]
}
test("Check compatibility, no matching parameter", () => {
    const results = calculateCompatibility([userNoMatch], [jobNoMatch]);
    expect(results[0].priorities[0].compatibility).toBeNaN
})
// Bug found;
// No handling for edge case where employee has no matching parameters for any jobs

// Check for one matching parameter and one excess parameter
const userOneMatch = {
    employee: {id: 1, user: { username: "Alan" } },
    answers: [
        {
            value: 4,
            question: {
                parameter: { name: "social" }
            }
        },
        {
            value: 4,
            question: {
                parameter: { name: "physical" }
            }
        }
    ]
} 
const jobOneMatch = {
    id: 1,
    name: "Store Clerk",
    capacity: 2,
    parameters: [
        {
            weight: 4,
            parameter: { name: "social" }
        }
    ]
}
test("Check compatibility, one excess parameter", () => {
    const results = calculateCompatibility([userOneMatch], [jobOneMatch]);
    expect(results[0].priorities[0].compatibility).toBe(1);
})

// Check distribute function

// Using previous users, checking if two user can overflow one job, and if the right user is selected
const jobOneCapacity = {
    id: 1,
    name: "Mascot",
    capacity: 1,
    parameters: [
        {
            weight: 4,
            parameter: { name: "physical" }
        }
    ]
}
test("Check for overflow of one job", () => {
    const results = calculateCompatibility([userHighScore, userLowScore], [jobOneCapacity]);
    const { jobMap } = distributeEmployees(results, [jobOneCapacity]);
    expect(jobMap[1].employees.length).toBe(1);
    expect(jobMap[1].employees[0].employee.username).toBe("Alan");
})

// Check for correct assignment of two different users
const socialUser = {
    employee: {id: 1, user: { username: "Chandler" } },
    answers: [
        {
            value: 4,
            question: {
                parameter: { name: "social" }
            }
        },
        {
            value: 1,
            question: {
                parameter: { name: "physical" }
            }
        }
    ],
}
const physicalUser = {
    employee: {id: 2, user: { username: "Denice" } },
    answers: [
        {
            value: 4,
            question: {
                parameter: { name: "physical" }
            }
        },
        {
            value: 1,
            question: {
                parameter: { name: "social" }
            }
        }
    ],
}
const socialJob = {
    id: 1,
    name: "Store Clerk",
    capacity: 1,
    parameters: [
        {
            weight: 4,
            parameter: { name: "social" }
        }
    ]
}
const physicalJob = {
    id: 2,
    name: "Cleaning",
    capacity: 1,
    parameters: [
        {
            weight: 4,
            parameter: { name: "physical" }
        }
    ]
}
test("Check for correct job assignment", () => {
    const results = calculateCompatibility([socialUser, physicalUser], [socialJob, physicalJob]);
    const { jobMap } = distributeEmployees(results, [socialJob, physicalJob]);
    console.log(JSON.stringify(jobMap, null, 2));
    expect(jobMap[1].employees[0].employee.username).toBe("Chandler");
    expect(jobMap[2].employees[0].employee.username).toBe("Denice");
})