//----------------12.3 Loading the post on the post page
$(document).ready(()=>{
    
    $.get("/api/posts/" + postId, results =>{
        outputPosts(results, $(".postsContainer"))
     })
})