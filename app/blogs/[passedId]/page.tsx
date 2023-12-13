const IdPage = ({ params }: { params: { passedId: String } }) => {
  // on the basis of this id, we fetch a post from fetch api
  return <p>This is id page: {params.passedId}</p>;
};

export default IdPage;
