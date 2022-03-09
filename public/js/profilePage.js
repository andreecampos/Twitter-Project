//----------------12.3 Loading the post on the post page
$(document).ready(()=>{
    
    $.get("/api/profile/" + userId, results =>{
        outputPosts(results, $(".postsContainer"))
     })
})
/*$(document).ready(()=>{
    
    const form = document.querySelector("form")
    const fileUpload = document.querySelector("#file-upload")

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        console.log(fileUpload.file)
    })
})*/