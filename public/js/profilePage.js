//----------------12.3 Loading the post on the post page
$(document).ready(()=>{
    
    $.get("/api/profile/" + userId, results =>{
        outputPosts(results, $(".postsContainer"))
     })
})
