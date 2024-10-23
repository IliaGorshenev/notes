import { TextEditor } from "framework7-react";
import { useState } from "react";

export default () => {
  const customButtons = {
    hr: {
      content: "<hr>",
      onClick() {
        document.execCommand("insertHorizontalRule", false);
      },
    },
  };

  const [customValue, setCustomValue] =
    useState(`<p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur sunt, sapiente quis eligendi consectetur hic asperiores assumenda quidem dolore quasi iusto tenetur commodi qui ullam sint sed alias! Consequatur, dolor!</p>
  <p>Provident reiciendis exercitationem reprehenderit amet repellat laborum, sequi id quam quis quo quos facere veniam ad libero dolorum animi. Nobis, illum culpa explicabo dolorem vitae ut dolor at reprehenderit magnam?</p>
  <p>Qui, animi. Dolores dicta, nobis aut expedita enim eum assumenda modi, blanditiis voluptatibus excepturi non pariatur. Facilis fugit facere sequi molestias nemo in, suscipit inventore consequuntur, repellat perferendis, voluptas odit.</p>
  <p>Tempora voluptates, doloribus architecto eligendi numquam facilis perspiciatis autem quam voluptas maxime ratione harum laudantium cum deleniti. In, alias deserunt voluptatibus eligendi libero nobis est unde et perspiciatis cumque voluptatum.</p>
  <p>Quam error doloribus qui laboriosam eligendi. Aspernatur quam pariatur perspiciatis reprehenderit atque dicta culpa, aut rem? Assumenda, quibusdam? Reprehenderit necessitatibus facere nemo iure maiores porro voluptates accusamus quibusdam. Nesciunt, assumenda?</p>`);

  const [listEditorValue, setListEditorValue] = useState("");

  return (
    <TextEditor
      placeholder="Enter text..."
      mode="popover"
      buttons={["bold", "italic", "underline", "strikeThrough"]}
    />
  );
};
