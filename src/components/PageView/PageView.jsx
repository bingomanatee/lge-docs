import React from 'react';
import pt from 'prop-types';
import Markdown from '../../views/Markdown';
import ContentFooter from '../../views/ContentFooter';
import HeadlineSub from "../../views/HeadlineSub";

const PageView = ({ header, error, html, file, link, label}) => (
  <div>
    {header && <HeadlineSub as="h2">{header}</HeadlineSub>}
    <Markdown error={error} html={html} file={file}/>
    {link && label && <ContentFooter label={label} link={link}/>}
  </div>
);

PageView.propTypes = {
  intro: pt.string,
  html: pt.string,
  file: pt.string,
  label: pt.string,
  link: pt.string,
  header: pt.string,
};

PageView.defaultProps = {
  html: '', markdown: '', file: '', error: false, link: '', label: false, header: '',
};

export default PageView;

