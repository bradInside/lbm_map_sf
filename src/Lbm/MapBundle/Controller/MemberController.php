<?php

namespace Lbm\MapBundle\Controller;

use Lbm\MapBundle\Entity\Member\Member;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;

class MemberController extends Controller
{
    /**
     * @Route("/member/add")
     * @Template()
     */
    public function addAction(Request $request)
    {
        if ($this->getRequest()->isXmlHttpRequest()) {

            if($request->getMethod() == 'POST') {
                $memberRepository = $this
                    ->getDoctrine()
                    ->getRepository('MapBundle:Member\Member');
                if($memberRepository->isPseudoAlreadyExist($request->get('pseudo'),$request->getClientIp())) {
                    $data = array('result'=>'error','Message'=>"Le pseudo existe déjà ou vous avez déjà ajouté votre position");
                }else {
                    $member = new Member();
                    $member->setPseudo($request->get('pseudo'));
                    $member->setLat($request->get('lat'));
                    $member->setLng($request->get('lng'));
                    $member->setIp($request->getClientIp());

                    $em = $this->getDoctrine()->getManager();
                    $em->persist($member);
                    $em->flush();

                    $data = array('result'=>'success');
                }

                $response = new \Symfony\Component\HttpFoundation\Response(json_encode($data));
                $response->headers->set('Content-Type', 'application/json');
                return $response;
            }else {
                throw new AccessDeniedException();
            }
        }else {
            throw new AccessDeniedException();
        }
    }

    /**
     * @Route("/member/search")
     * @Template()
     */
    public function searchAction()
    {
    }

}
