//----------8.1 Creating the home page  JavaScript file -------
//8.1 is gonna load the post when the page loads
$(document).ready(()=>{
    //-------8.2 Getting posts from the database------------
    $.get("/api/posts", results =>{
        outputPosts(results, $(".postsContainer"))
    
 
     })
})
$(document).ready(()=>{
    //-------8.2 Getting posts from the database------------
    $.get("/api/posts", results =>{
        outputPosts(results, $(".postsContainer"))
    
 
     })
})

//---------------8.3 Outputting posts on the page------------
function outputPosts(results, container){
 container.html("");
//loopar over this list and every single iteration will be referred to as result.
 results.forEach(result =>{
        const html = createPostHtml(result ) //createPostHtml come from common.js
        container.append(html);
    });
    if(results.lengt == 0){
        container.append("<span class='noResults'>Nothing to show</span>")
    }
}