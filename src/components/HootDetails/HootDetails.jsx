import { useParams, Link } from "react-router";
import * as hootService from "../../services/hootService"
import { useEffect, useState, useContext } from "react";
import CommentForm from "../CommentForm/CommentForm";
import { UserContext } from "../../contexts/UserContext"
import styles from './HootDetails.module.css';
import Loading from '../Loading/Loading';
import Icon from '../Icon/Icon';
import AuthorInfo from '../../components/AuthorInfo/AuthorInfo';

const HootDetails = (props) => {
    const { hootId } = useParams();
    const { user } = useContext(UserContext);
    const [hoot, setHoot] = useState(null);

    const handleAddComment = async (commentFormData) => {
        const newComment = await hootService.createComment(hootId, commentFormData);
        setHoot({ ...hoot, comments: [...hoot.comments, newComment] });

    };

    const handleDeleteComment = async (commentId) => {
        await hootService.deleteComment(hootId, commentId);
        setHoot({
            ...hoot,
            comments: hoot.comments.filter((comment) => comment._id !== commentId),
        });
    };


    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            setHoot(hootData);
        };
        fetchHoot();
    }, [hootId]);

    if (!hoot) return <main><Loading /></main>;

    return (
        <main className={styles.container}>
            <section>
                <header>
                    <p>{hoot.category.toUpperCase()}</p>
                    <h1>{hoot.title}</h1>
                    <div>
                        <AuthorInfo content={hoot} />
                        {hoot.author._id === user._id && (
                            <>
                                <Link to={`/hoots/${hootId}/edit`}>
                                    <Icon category='Edit' />
                                </Link>
                                <button onClick={() => props.handleDeleteHoot(hootId)}>
                                    <Icon category='Trash' />
                                </button>
                            </>
                        )}
                    </div>
                </header>
                <p>{hoot.text}</p>
            </section>
            <section>
                <h2>Comments</h2>
                <CommentForm handleAddComment={handleAddComment} />
                {!hoot.comments.length && <p>There are no comments.</p>}

                {hoot.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            <div>
                                <AuthorInfo content={comment} />
                                {comment.author._id === user._id && (
                                    <>
                                        <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>
                                            <Icon category='Edit' />
                                        </Link>
                                        <button onClick={() => handleDeleteComment(comment._id)}>
                                            <Icon category='Trash' />
                                        </button>
                                    </>
                                )}
                            </div>
                        </header>
                        <p>{comment.text}</p>
                    </article>
                ))}
            </section>
        </main>
    )
}



export default HootDetails;