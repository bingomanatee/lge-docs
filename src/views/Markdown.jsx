import React from 'react';
import pt from 'prop-types';

const Markdown = ({error, html, file}) => {
  if (error) {
    return <div>Error loading {file}: {JSON.stringify(error)}</div>
  }
  if (html) {
    return <div dangerouslySetInnerHTML={{__html: html}}/>
  }
  return '';
};

Markdown.propTypes = {
  intro: pt.string,
  html: pt.string,
  file: pt.string
};

Markdown.defaultProps = {
  html: '', markdown: '', file: '', error: false
};

export default Markdown;

