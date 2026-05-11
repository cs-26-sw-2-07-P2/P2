

export async function renderDepartmentViewerPage(container){
    container.innerHTML = `
    <h1>HI</h1>
    <div id="sortableList">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
    </div>
    `
    new Sortable(document.getElementById("sortableList"), {
        animation: 150,

    });
}

const mockData = {
    systemScore: 0.84,
    jobMap: {
        1: {
            name: "Warehouse",
            capacity: 3,
            amount: 2,
            fillRate: 0.67,
            averageCompatibility: 0.81,
            employees: [
                { compatibility: 0.85, employee: { username: "alice" } },
                { compatibility: 0.77, employee: { username: "bob" } },
            ]
        },
        2: {
            name: "Logistics",
            capacity: 2,
            amount: 2,
            fillRate: 1.0,
            averageCompatibility: 0.91,
            employees: [
                { compatibility: 0.93, employee: { username: "charlie" } },
                { compatibility: 0.89, employee: { username: "diana" } },
            ]
        }
    }
};


let employees = [];



function createDepartmentTables(employees){

}