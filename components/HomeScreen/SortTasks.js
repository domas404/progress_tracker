// sorts tasks by provided order
export default function SortTasks(tasksToSort, sortingOrder, sortAsc) {
    let sortedTasks;        
    switch(sortingOrder){
        case 'date':
            if(sortAsc)
                sortedTasks = tasksToSort.sort((a, b) => Date.parse(a.dateCreated) - Date.parse(b.dateCreated));
            else
                sortedTasks = tasksToSort.sort((a, b) => Date.parse(b.dateCreated) - Date.parse(a.dateCreated));
            break;
        case 'title':
            if(sortAsc){
                sortedTasks = tasksToSort.sort((a, b) => {
                    if(a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                    if(a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                });
            }
            else{
                sortedTasks = tasksToSort.sort((a, b) => {
                    if(a.title.toLowerCase() > b.title.toLowerCase()) return -1;
                    if(a.title.toLowerCase() < b.title.toLowerCase()) return 1;
                });
            }
            break;
        case 'progress':
            if(sortAsc)
                sortedTasks = tasksToSort.sort((a, b) => a.percent - b.percent);
            else
                sortedTasks = tasksToSort.sort((a, b) => b.percent - a.percent);
            break;
        case 'deadline':
            if(sortAsc)
                sortedTasks = tasksToSort.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
            else
                sortedTasks = tasksToSort.sort((a, b) => Date.parse(b.dueDate) - Date.parse(a.dueDate));
            break;
    }
    return sortedTasks;
}