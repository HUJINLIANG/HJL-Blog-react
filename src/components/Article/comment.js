/**
 * Created by jialao on 2016/7/25.
 */
import React from 'react'
import defaultAvatar from '../../assets/imgs/userimg.png'
import {formatDate} from '../../utiles'
import Reply from './reply'

export default class Comment extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            commentContent:'',
            openedForm:null
        }
        this.handleCommentContentChange = this.handleCommentContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.showReply = this.showReply.bind(this);
        this.handleSubmitReply = this.handleSubmitReply.bind(this);
        this.clearText = this.clearText.bind(this)
    }
    handleCommentContentChange(e){
        this.setState({
            commentContent:e.target.value
        })
    }
    handleSubmit(submitComment){
        return (e) =>{
            submitComment(e,this.state.commentContent);
            this.setState({
                commentContent:''
            })
        }

    }

    showReply(e,k,nickname){
        e.preventDefault();
        const {auth} = this.props;
        if(auth.token){
            const eleForm = this.refs['reply_form_'+k];
            const eleTextarea = eleForm.getElementsByTagName('textarea')[0];
            if(eleForm.className.indexOf('hide') != -1){
                eleForm.className = 'new-reply';
                eleTextarea.focus();
                this.refs['replyContent'+k].value = '@' + nickname + ' ';

                var oldOpened = this.state.openedForm;
                if(oldOpened !== null){
                    this.refs['reply_form_'+oldOpened].className += ' hide';
                }
                this.setState({
                    openedForm:k
                })

            }else{
                eleForm.className += ' hide';
                this.setState({
                    openedForm:null
                })
                
            }
        }else{
            const {openLoginModal} = this.props;
            openLoginModal()
        }
    }

    handleSubmitReply(e,i,cid){
        e.preventDefault();
        const content = this.refs['replyContent'+i].value;
        const {submitReply} = this.props;
        const eleForm = this.refs['reply_form_'+i];
        submitReply(e,cid,content);
        eleForm.className += ' hide';
        this.setState({
            openedForm:null,
            commentContent:''
        })
    }

    clearText(e){
        e.preventDefault()
        this.setState({
            commentContent:''
        })
    }

    render(){
        const {commentList,auth,submitComment,openLoginModal} = this.props
        return (
            <div className="comment-container clearfix">
                { auth.token ?

                    <div className="comment-reply">
                        <a className="reply-avatar" href="javascript:;">
                            {auth&&auth.user? <img src={auth.user.avatar || defaultAvatar}/>
                                :
                                <img src={ defaultAvatar}/>
                            }
                        </a>
                        <form className="comment-form" onSubmit={this.handleSubmit(submitComment)}>
                            <div className="comment-content">
                                <textarea
                                    maxLength="2000"
                                    required
                                    placeholder="写下你的评论…"
                                    onChange={this.handleCommentContentChange}
                                    id="comment_content"  value={this.state.commentContent}>

                                </textarea>
                            </div>
                            <div className="button-container clearfix">
                                <input type="submit" id="comment_submit_btn" value="发 表" className="btn btn-info pull-right" />
                                <button className="btn btn-danger pull-right" onClick={this.clearText}>清空</button>

                            </div>
                        </form>
                    </div>


                    // <form className="new_comment" onSubmit={this.handleSubmit(submitComment)}>
                    //     <div className="comment-text">
                    //     <textarea
                    //         maxLength="2000"
                    //         required
                    //         placeholder="写下你的评论…"
                    //         onChange={this.handleCommentContentChange}
                    //         id="comment_content"  value={this.state.commentContent}>
                    //
                    //     </textarea>
                    //         <div>
                    //             <input type="submit" id="comment_submit_btn" value="发 表" className="btn btn-info" />
                    //         </div>
                    //     </div>
                    // </form>
                    :
                    <div>
                        <p className="comment-signin">
                            <button className="btn btn-info" onClick={openLoginModal}>登录后发表评论</button>
                        </p>
                    </div>
                }
                <div className="comment-des clearfix">
                    {commentList.items.length || 0}条评论
                </div>
                <div id="comment_list">
                    {commentList.items.map((comment,i) =>
                            <div className="comment-item" key={i}>
                                <div className="content">
                                    <div className="meta-top">
                                        <a className="avatar">
                                            <img src={comment.user_id.avatar || defaultAvatar} alt={comment.user_id.nickname} />
                                        </a>
                                        <a className="author-name link-light">{comment.user_id.nickname}</a>
                                        <span className="reply-time">
                                            {formatDate(comment.created)}
                                        </span>
                                    </div>
                                    <p className="comment-content">{comment.content}</p>
                                    <div className="comment-footer text-right">
                                        <a className="reply" href="javascript:;" onClick={e=>this.showReply(e,i,comment.user_id.nickname)}>回复</a>
                                    </div>
                                    <Reply replys={comment.replys} k={i} showReply={this.showReply}/>

                                    <form className="new-reply hide" ref={'reply_form_'+i} id={'reply_form_'+i} onSubmit={e=>this.handleSubmitReply(e,i,comment._id)}>
                                        <div className="comment-text">
                                         <textarea id={'replyContent'+i}
                                                   maxLength="2000"
                                                   ref={'replyContent'+i}
                                                   placeholder="写下你的回复…"> </textarea>
                                            <div>
                                                <input type="submit" value="发 表" className="btn btn-sm btn-info" />
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                    )}
                </div>

                <ul className="comments">
                    {commentList.items.map((comment,i) =>
                        <li className="comments-item" key={i}>
                            <div className="comment-self">
                                <div className="comment-selt-avatar">
                                    <img src={comment.user_id.avatar || defaultAvatar} alt=""/>
                                </div>
                                <div className="comment-self-body">
                                    <div className="comment-self-header">
                                        <span>{comment.user_id.nickname}</span>
                                    </div>
                                    <p className="comment-self-content">{comment.content}</p>
                                    <div className="comment-self-footer">
                                        <span className="commment-time">{formatDate(comment.created)}</span>
                                        <a href="javascript:;" className="comment-reply" onClick={e=>this.showReply(e,i,comment.user_id.nickname)}>
                                            <i className="fa fa-mail-reply"> </i>
                                            回复
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <Reply replys={comment.replys} k={i} showReply={this.showReply}/>
                            
                            
                            <div className="content">
                                <div className="meta-top">
                                    <a className="avatar">
                                        <img src={comment.user_id.avatar || defaultAvatar} alt={comment.user_id.nickname} />
                                    </a>
                                    <a className="author-name link-light">{comment.user_id.nickname}</a>
                                        <span className="reply-time">
                                            {formatDate(comment.created)}
                                        </span>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                                <div className="comment-footer text-right">
                                    <a className="reply" href="javascript:;" onClick={e=>this.showReply(e,i,comment.user_id.nickname)}>回复</a>
                                </div>
                                <Reply replys={comment.replys} k={i} showReply={this.showReply}/>

                                <form className="new-reply hide" ref={'reply_form_'+i} id={'reply_form_'+i} onSubmit={e=>this.handleSubmitReply(e,i,comment._id)}>
                                    <div className="comment-text">
                                         <textarea id={'replyContent'+i}
                                                   maxLength="2000"
                                                   ref={'replyContent'+i}
                                                   placeholder="写下你的回复…"> </textarea>
                                        <div>
                                            <input type="submit" value="发 表" className="btn btn-sm btn-info" />
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </li>
                    )}
                </ul>

            </div>
        )
    }
}