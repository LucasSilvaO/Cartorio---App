import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { capitalizeFirstLetter } from '../../../../utils/stringFunctions';

const InfoUser = ({ username, email, user_type, name }) => {
    return (
        <Card className="info-user">
            <CardBody>
                <CardText style={{fontWeight:"bold"}}> {username}</CardText>
                <CardTitle style={{fontWeight:"bold"}}>{name}</CardTitle>
                <CardText>{email}</CardText>
                <CardText style={{fontWeight:"bold"}}>{capitalizeFirstLetter(user_type)}</CardText>
                <Button color="danger" onClick={() => {
                    sessionStorage.clear();
                    window.location.href = '/';
                }}>Sair</Button>
            </CardBody>
        </Card>
    );
};

InfoUser.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
};

export default InfoUser;