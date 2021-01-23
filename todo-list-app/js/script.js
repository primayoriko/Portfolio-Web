const ongoingList = document.getElementById("ongoing-list");
const completedList = document.getElementById("completed-list");

function createListItem(input, addCompleteButton = true){
    const deleteButton = document.createElement("button")
    const buttonContainer = document.createElement("div")
    const childName = document.createElement('p')
    const child = document.createElement("div")

    childName.innerText = input
    deleteButton.innerText = "delete"

    deleteButton.className = "delete-button"
    buttonContainer.className = "button-panel"
    childName.className = "list-text"
    child.className = "list-content"

    if(addCompleteButton){
        const completeButton = document.createElement("button")
        completeButton.innerText = "complete"
        buttonContainer.appendChild(completeButton)
        completeButton.className = "complete-button"
        completeButton.addEventListener("click", completeTask)
    }

    buttonContainer.appendChild(deleteButton)
    child.appendChild(childName)
    child.appendChild(buttonContainer)

    deleteButton.addEventListener("click", deleteTask)

    return child
}

function addNewTask(task){
 const input = document.getElementById("input").value
 if(input == ""){
    alert("cant be empty")
    return
 } else {
    document.getElementById("input").value = ""
 }

 ongoingList.style.display = "flex"
 ongoingList.appendChild(createListItem(input))
}

function completeTask(){
    const container = this.parentNode.parentNode
    const containerParent = this.parentNode.parentNode.parentNode
    const taskName = container.getElementsByTagName('p')[0].innerText

    containerParent.removeChild(container)

    if(containerParent.childElementCount == 0){
        containerParent.style.display = "none"
    }

    completedList.style.display = "flex"
    completedList.appendChild(createListItem(taskName, false))
}

function deleteTask(){
    const container = this.parentNode.parentNode
    const containerParent = this.parentNode.parentNode.parentNode

    containerParent.removeChild(container)

    if(containerParent.childElementCount == 0){
        containerParent.style.display = "none"
    }
}