<?php

namespace Lbm\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class MapController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function openAction()
    {
        //getting all members
        $memberRepo = $this->getDoctrine()->getRepository('MapBundle:Member\Member');
        $queryMembers = $memberRepo->getPartialMembersQuery();

        $members = $queryMembers->getResult();

        $integrated = $this->getRequest()->query->get('integrated');
        return array('members'=>$members,'integrated'=>$integrated);
    }

}
