import React, { useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import "./post.css";

export default function Post({ post }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log("Image failed to load:", post.photo);
    setImageError(true);
  };

  const renderHTMLContent = (content) => {
    return (
      <div 
        className="postDesc"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
              'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'img',
              'div'
            ],
            ALLOWED_ATTR: [
              'href', 'target', 'style', 'class', 'src', 'alt', 
              'rel', 'title', 'width', 'height'
            ],
            ALLOWED_STYLES: [
              'color', 'font-family', 'font-size', 'font-weight', 'text-align',
              'margin', 'padding', 'text-decoration', 'font-style'
            ]
          })
        }}
      />
    );
  };

  return (
    <div className="post">
       <Link to={`/post/${post._id}`} className="link">
      {post.photo && !imageError ? (
        <div className="postImgContainer">
          <img
            className="postImg"
            src={post.photo}
            alt={post.title}
            onError={handleImageError}
          />
        </div>
      ) : imageError && (
        <div className="imageError">
          <span>Failed to load image</span>
        </div>
      )}
      </Link>
      
      <div className="postInfo">
        <div className="postMeta">
          <div className="postCats">
            {post.categories?.map((c, index) => (
              <span className="postCat" key={index}>
                {c.name}
              </span>
            ))}
          </div>
          <span className="postDate">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        <Link to={`/post/${post._id}`} className="link">
          <h2 className="postTitle">{post.title}</h2>
        </Link>
        
        {post.author && (
          <div className="postAuthor">
            <Link to={`/author/${post.author.username}`} className="link">
              <span className="authorName">By {post.author.username}</span>
            </Link>
          </div>
        )}
     
      </div>
      <Link to={`/post/${post._id}`} className="link">
      {renderHTMLContent(post.desc)}
      </Link>
      <div className="postFooter">
        <Link to={`/post/${post._id}`} className="readMoreLink text-blue-700">
          Read More →
        </Link>
      </div>
    </div>
  );
}