import React from "react";

const Denied = () => {
  return (
    <div className="both-center">
      <div className="block max-w-2xl m-5 h-32 text-center">
        <h1 className="text-error">Permission Denied</h1>
        <p className="mt-5">
          You don&apos;t have enough permission to perform requested action or
          view requested content. If you think this is a mistake please contact
          admin.
        </p>
      </div>
    </div>
  );
};

export default Denied;
