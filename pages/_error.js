function Error({ statusCode }) {
    return (
        <p>
            {statusCode
                ? `Đã xảy ra lỗi ${statusCode} trên server`
                : "Đã xảy ra lỗi trên client"}
        </p>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
