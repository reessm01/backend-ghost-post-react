import React, { useState, useEffect } from "react"
import { api } from "./constants"

function NavBar() {
  return (
    <nav class="nav mb-3 justify-content-center">
      <a class="nav-link" href="/">
        Index
      </a>
      <a class="nav-link" href="post">
        New Post
      </a>
      <a class="nav-link" href="boasts">
        Boasts
      </a>
      <a class="nav-link" href="roasts">
        Roasts
      </a>
      <a class="nav-link" href="topvoted">
        Sort by Top Voted
      </a>
      <a class="nav-link" href="leastvoted">
        Sort by Least Voted
      </a>
    </nav>
  )
}

function PostHeader(props) {
  return props.post.fields.is_boast ? (
    <div
      class="d-flex justify-content-between alert alert-success mb-0"
      role="alert"
    >
      {props.post.fields.created_at}
      <form method="POST" action="delete/?id={{ post.id }}">
        <button type="submit" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </form>
    </div>
  ) : (
    <div
      class="d-flex justify-content-between alert alert-danger mb-0"
      role="alert"
    >
      {props.post.fields.created_at}
      <form method="POST" action="delete/?id={{ post.id }}">
        <button type="submit" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </form>
    </div>
  )
}

function PostBody(props) {
  return (
    <React.Fragment>
      <div class="card-body">{props.post.fields.text}</div>
      <div class="btn-toolbar ml-3 mb-3" role="toolbar">
        <div class="input-group mr-3">
          <div class="input-group-prepend">
            <form method="POST" action="upvote/?id={{ post.id }}">
              <button type="submit" class="btn btn-success">
                +
              </button>
            </form>
          </div>
          <div class="input-group-prepend">
            <form method="POST" action="downvote/?id={{ post.id }}">
              <button type="submit" class="btn btn-danger">
                -
              </button>
            </form>
          </div>
          <div class="input-group-append">
            <div class="input-group-text" id="btnGroupAddon">
              {props.post.fields.vote_count}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function Main() {
  const [posts, setPosts] = useState([])
  const [displayedPosts, setDisplayedPosts] = useState([])

  useEffect(() => {
    fetch(api)
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setDisplayedPosts(data)
      })
  }, [])

  return (
    <div class="container" fluid="true">
      <div class="row justify-content-center">
        <div class="col-10">
          <h1 class="mt-2">Ghost Post</h1>
          <hr class="mt-0 mb-4" />
          <NavBar />
          {displayedPosts.map(post => {
            return (
              <div class="card mb-3">
                <PostHeader post={post} />
                <PostBody post={post} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Main
