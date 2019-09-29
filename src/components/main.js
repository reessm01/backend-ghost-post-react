import React, { useState, useEffect } from "react"
import { Form, Button, Container, Row } from "react-bootstrap"
import Cookies from "universal-cookie"
import { api } from "./constants"

function NavBar(props) {
  return (
    <Container fluid>
      <Row className="mb-3 justify-content-md-center">
      <Button
        className = "mr-2"
        onClick={e => {
          e.preventDefault()
          props.handleAllPosts()
        }}
      >
        All
      </Button>
      <Button
        className = "mr-2"
        onClick={e => {
          e.preventDefault()
          props.handleFilterPosts(true)
        }}
      >
        Boasts
      </Button>
      <Button
        className = "mr-2"
        onClick={e => {
          e.preventDefault()
          props.handleFilterPosts(false)
        }}
      >
        Roasts
      </Button>
      <Button
        className = "mr-2"
        onClick={e => {
          e.preventDefault()
          props.handleSort(true)
        }}
      >
        Sort by Top Voted
      </Button>
      <Button
        onClick={e => {
          e.preventDefault()
          props.handleSort(false)
        }}
      >
        Sort by Least Voted
      </Button>
      </Row>
    </Container>
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

function NewPostForm(props) {
  const [text, setText] = useState("")

  function handlePostForm(event) {
    event.preventDefault()

    const data = new FormData(event.target)

    let text = data.get('text')
    let is_boast = data.get('isRoast') === 'on' ? 1 : 0
    
    event.target[0].value = ''
    setText('')
    fetch(api + 'post', {
      method: 'POST',
      body: JSON.stringify({
        text,
        is_boast
      })
    })
    .then(res => res.json())
    .then(res => {
      props.handleNewPost(res)
    })
  }

  return (
    <Container className="border rounded pr-4 pl-4 pt-4 mb-4">
      <Form onSubmit={e => handlePostForm(e)}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>
            What are you thinking? Or what grinds your gears?
          </Form.Label>
          <Form.Control
            onChange={e => {
              e.preventDefault()
              setText(e.target.value)
            }}
            rows="3"
            style={{resize: "none"}}
            type="text"
            name="text"
            placeholder=""
            maxlength="280"
          />
          {text.length <= 280 ? (
            <Form.Text className="text-muted">
              {280 - text.length} characters remaining...
            </Form.Text>
          ) : (
            <Form.Text className="text-danger">
              {280 - text.length} characters remaining...
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Is Roast" name="isRoast"/>
        </Form.Group>
      </Form>
    </Container>
  )
}

function PostBody(props) {
  return (
    <React.Fragment>
      <div class="card-body">{props.post.fields.text}</div>
      <div class="btn-toolbar ml-3 mb-3" role="toolbar">
        <div class="input-group mr-3">
          <div class="input-group-prepend">
            <form method="GET">
              <button
                type="submit"
                class="btn btn-success"
                onClick={e => {
                  props.handleVote(
                    `upvote/?id=${props.post.pk}`,
                    props.post.pk,
                    1,
                    e
                  )
                }}
              >
                +
              </button>
            </form>
          </div>
          <div class="input-group-prepend">
            <form method="GET">
              <button
                type="submit"
                class="btn btn-danger"
                onClick={e => {
                  props.handleVote(
                    `downvote/?id=${props.post.pk}`,
                    props.post.pk,
                    -1,
                    e
                  )
                }}
              >
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

  const cookies = new Cookies()

  function handleVote(endpoint, id, value, event) {
    event.preventDefault()
    fetch(api + endpoint)
      .then(res => {
        if (res.status === 200) {
          let newDisplay = Array.from(displayedPosts)
          let singlePost = newDisplay.filter(post => post.pk === id)[0]
          singlePost.fields.vote_count += value
          setDisplayedPosts(newDisplay)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  function handleFilterPosts(isBoast) {
    const newDisplay = posts.filter(post => post.fields.is_boast === isBoast)
    setDisplayedPosts(newDisplay)
  }

  function handleSort(ascending) {
    const newDisplay = Array.from(displayedPosts)
    if (ascending) {
      newDisplay.sort(function(a, b) {
        if (a.fields.vote_count < b.fields.vote_count) return 1
        else if (a.fields.vote_count > b.fields.vote_count) return -1
        else return 0
      })
    } else {
      newDisplay.sort(function(a, b) {
        if (a.fields.vote_count < b.fields.vote_count) return -1
        else if (a.fields.vote_count > b.fields.vote_count) return 1
        else return 0
      })
    }
    setDisplayedPosts(newDisplay)
  }

  function handleNewPost(res) {
    let newDisplay = Array.from(displayedPosts)
    let newAllPosts = Array.from(posts)
    newDisplay.unshift(res[0])
    newAllPosts.unshift(res[0])
    
    setDisplayedPosts(newDisplay)
    setPosts(newAllPosts)
  }

  function handleAllPosts() {
    setDisplayedPosts(posts)
  }

  useEffect(() => {
    fetch(api)
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setDisplayedPosts(data)
      })

    if (cookies.get("csrf-token") === undefined) {
      fetch(api + "token")
        .then(res => res.json())
        .then(data => {
          cookies.set("csrf-token", data.csrfToken)
        })
    }
  }, [])

  return (
    <div class="container" fluid="true">
      <div class="row justify-content-center">
        <div class="col-10">
          <h1 class="mt-2">Ghost Post</h1>
          <hr class="mt-0 mb-4" />
          <NavBar
            handleFilterPosts={handleFilterPosts}
            handleSort={handleSort}
            handleAllPosts={handleAllPosts}
          />
          <NewPostForm handleNewPost={handleNewPost} displayedPosts={displayedPosts}/>
          {displayedPosts.map(post => {
            return (
              <div class="card mb-3">
                <PostHeader post={post} />
                <PostBody post={post} handleVote={handleVote} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Main
