import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { fetchBlocksStart } from "../../redux/blocks/blocks.actions";
import { selectBlocksArray } from "../../redux/blocks/blocks.selector";
import Block from "../../components/block/Block";
import BaseLayout from "../../components/base-layout/BaseLayout";

const Blocks = (props) => {
  const { blocks, fetchBlocksStart } = props;
  console.log("props inblocks", props);
  useEffect(() => {
    fetchBlocksStart();
    return console.log("I am unmounting from Blocks");
  }, []);

  return (
    <BaseLayout>
      <h3>Blocks</h3>
      {blocks.map((block, index) => {
        return <Block key={index} block={block} />;
      })}
    </BaseLayout>
  );
};

const mapStateToProps = createStructuredSelector({
  blocks: selectBlocksArray,
});

export default connect(mapStateToProps, { fetchBlocksStart })(Blocks);
