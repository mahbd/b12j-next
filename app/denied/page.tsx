import React from "react";

const Denied = () => {
  return (
    <div>
      <h1 className="text-error">Permission Denied</h1>
      <p>
        You don&apos;t have enough permission to perform requested action or
        view requested content. If you think this is a mistake please contact
        admin.
      </p>
    </div>
  );
};

export default Denied;
